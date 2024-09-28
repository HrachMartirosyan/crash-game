import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import classnames from "classnames";
import { io, Socket } from "socket.io-client";

import styles from "./Game.page.module.scss";

import { useGameConfigQuery } from "../../tanstack/game.query.tsx";
import { usePlayerQuery } from "../../tanstack/player.query.tsx";

import { Box, Button, ButtonGroup, Typography } from "../../components";
import { Loading } from "../../components/Icons/assets";
import { TextField } from "../../components/Inputs/TextField";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../atoms/player.atom.ts";
import { Player } from "../../dto/player.dto.ts";
import { RocketGame } from "../../components/Game/Rocket/Rocket.game.tsx";

enum ServerEvents {
  GAME_STARTER_DATA = "gameStarterData",
  ROUND_STATUS_CHANGED = "roundStatusChanged",
  COEF = "coef",
  BALANCE = "balance",
  BET_PLACED = "betPlaced",
}

enum ClientEvents {
  BET = "bet",
  CASHOUT = "cashout",
}

enum GameState {
  IDLE = "IDLE",
  BETTING = "BETTING",
  EXECUTING = "EXECUTING",
  COMPLETED = "COMPLETED",
}

export const GamePage = () => {
  const navigate = useNavigate();
  const { isLoading: isGameConfigLoading, data: gameConfig } =
    useGameConfigQuery();

  const { isLoading: isPlayerLoading } = usePlayerQuery();
  const [player, setPlayer] = useRecoilState(PlayerState);

  const isLoading = isGameConfigLoading || isPlayerLoading;

  const [searchParams] = useSearchParams();

  const socket = useRef<Socket>();

  const [coef, setCoef] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [bet, setBet] = useState<number | null>(null);
  const [betError, setBetError] = useState<string>("");
  const [lastBet, setLastBet] = useState<number | null>(null);
  const [lastWon, setLastWon] = useState<number | null>(null);
  const [betPlaced, setBetPlaced] = useState<number | null>(null);

  const initSocket = useCallback((sessionID: string) => {
    socket.current = io("http://localhost:3000", {
      transports: ["websocket"],
      upgrade: false,
      auth: {
        token: sessionID,
      },
    });
  }, []);

  const onGameStarterDataEmit = useCallback(
    (data: { roundStatus: GameState }) => {
      if (data.roundStatus) {
        setGameState(data.roundStatus);
      }
    },
    [],
  );

  const onRoundStatusChangedEmit = useCallback(
    (data: { roundStatus: GameState }) => {
      console.log("ROUND_STATUS_CHANGED", data);
      if (data.roundStatus) {
        setGameState(data.roundStatus);

        if (data.roundStatus === GameState.COMPLETED && betPlaced) {
          setLastBet(betPlaced);
          setBetPlaced(null);
        }
      }
    },
    [betPlaced],
  );

  const onCoefEmit = useCallback(
    (data: number) => {
      setCoef(data);
    },
    [setCoef],
  );

  const onBalanceEmit = useCallback(
    (data: { balance: number }) => {
      if (player && data.balance > player.balance) {
        setLastWon(data.balance - player?.balance);
      }
      setPlayer({ ...player, balance: Number(data.balance) } as Player);
    },
    [player, setPlayer],
  );

  const onBetPlaced = useCallback(
    (data: { bet: number; balance: number }) => {
      setBetPlaced(bet);
      setPlayer({ ...player, balance: Number(data.balance) } as Player);
    },
    [bet, player, setPlayer],
  );

  const handleEmits = useCallback(() => {
    if (!socket.current) {
      return;
    }

    socket.current.on(ServerEvents.GAME_STARTER_DATA, onGameStarterDataEmit);

    socket.current.on(
      ServerEvents.ROUND_STATUS_CHANGED,
      onRoundStatusChangedEmit,
    );

    socket.current.on(ServerEvents.COEF, onCoefEmit);

    socket.current.on(ServerEvents.BALANCE, onBalanceEmit);
    socket.current.on(ServerEvents.BET_PLACED, onBetPlaced);
  }, [
    onBalanceEmit,
    onBetPlaced,
    onCoefEmit,
    onGameStarterDataEmit,
    onRoundStatusChangedEmit,
  ]);

  const offEmits = useCallback(() => {
    if (!socket.current) {
      return;
    }

    socket.current.off(ServerEvents.GAME_STARTER_DATA, onGameStarterDataEmit);

    socket.current.off(
      ServerEvents.ROUND_STATUS_CHANGED,
      onRoundStatusChangedEmit,
    );

    socket.current.off(ServerEvents.COEF, onCoefEmit);

    socket.current.off(ServerEvents.BALANCE, onBalanceEmit);
    socket.current.off(ServerEvents.BET_PLACED, onBetPlaced);
  }, [
    onBalanceEmit,
    onBetPlaced,
    onCoefEmit,
    onGameStarterDataEmit,
    onRoundStatusChangedEmit,
  ]);

  useEffect(() => {
    if (!gameConfig?.data?.minBet || bet !== null) {
      return;
    }

    setBet(gameConfig.data.minBet);
  }, [bet, gameConfig]);

  useEffect(() => {
    const sessionID = searchParams.get("s");
    if (!sessionID) {
      navigate("/");
      return;
    }

    if (!socket.current) {
      initSocket(sessionID);
    }

    handleEmits();

    return () => {
      offEmits();
    };
  }, [handleEmits, initSocket, navigate, offEmits, searchParams]);

  const formatNumber = useCallback(
    (value: number) => new Intl.NumberFormat("en-en").format(value),
    [],
  );

  const getGameText = useCallback(() => {
    if (gameState === GameState.IDLE) {
      return "Game will start soon..";
    }

    if (gameState === GameState.BETTING) {
      return "Place your bet";
    }

    if (gameState === GameState.COMPLETED) {
      return `BOOM x${coef}`;
    }

    if (gameState === GameState.EXECUTING) {
      return `x${coef}`;
    }
  }, [gameState, coef]);

  const actionsDisabled = useMemo(
    () => gameState !== GameState.BETTING,
    [gameState],
  );

  const onBetChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setBet(Number(e.target.value));
    },
    [setBet],
  );

  const makeBet = useCallback(() => {
    if (!gameConfig?.data || !bet || !socket.current) {
      return;
    }

    if (bet < gameConfig?.data?.minBet || bet > gameConfig?.data?.maxBet) {
      setBetError(
        `Bet should be more than ${gameConfig.data.minBet} or less than ${gameConfig.data.maxBet}`,
      );
      return;
    }

    setBetError("");

    socket.current.emit(ClientEvents.BET, {
      amount: bet,
    });
  }, [bet, gameConfig]);

  const doCashout = useCallback(() => {
    socket.current?.emit(ClientEvents.CASHOUT, {
      coef,
    });
  }, [coef]);

  return (
    <Box className={classnames("center", "wHeight", styles.main)}>
      {isLoading && <Loading className={styles.loading} />}
      {!isLoading && (
        <Box className={classnames("center", "wHeight", styles.gameBox)}>
          <Box className={classnames(styles.gameWrapper)}>
            {gameState === GameState.EXECUTING ||
            gameState === GameState.COMPLETED ? (
              <RocketGame
                state={gameState === GameState.EXECUTING ? "FLYING" : "BOOM"}
              />
            ) : (
              <></>
            )}
            <Typography variant="h4">{getGameText()}</Typography>
          </Box>
          <br />
          <Box className={classnames(styles.actionsWrapper)}>
            <ButtonGroup>
              {gameConfig?.data?.bets?.length ? (
                gameConfig.data.bets.map((bet) => (
                  <Button
                    key={bet}
                    disabled={actionsDisabled}
                    onClick={() => setBet(bet)}
                  >
                    {bet}
                  </Button>
                ))
              ) : (
                <></>
              )}
            </ButtonGroup>
            <TextField
              placeholder="Amount"
              value={bet as number}
              onChange={onBetChange}
              disabled={actionsDisabled}
              error={betError}
            />
            {!betPlaced ? (
              <Button disabled={actionsDisabled} onClick={makeBet}>
                BET
              </Button>
            ) : (
              <Button disabled={!actionsDisabled} onClick={doCashout}>
                Cashout
              </Button>
            )}
          </Box>
          <br />
          <br />
          <Box className={classnames(styles.actionsWrapper)}>
            <Typography variant="h5">
              Balance - {player?.balance ? formatNumber(player.balance) : ""}
            </Typography>
            <Typography variant="h5">
              Current bet - {betPlaced ? formatNumber(betPlaced) : ""}
            </Typography>
            <Typography variant="h5">
              Last bet - {lastBet ? formatNumber(lastBet) : ""}
            </Typography>
            <Typography variant="h5">
              Last won - {lastWon ? formatNumber(lastWon) : ""}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
