import { useCallback, useEffect } from "react";
import classnames from "classnames";

import { Box, Button } from "../../components";

import { useGameInitMutation } from "../../tanstack/game.query.tsx";
import { useNavigate } from "react-router-dom";

export const MenuPage = () => {
  const navigate = useNavigate();
  const gameInitMutation = useGameInitMutation();

  const initGame = useCallback(() => {
    gameInitMutation.mutate();
  }, [gameInitMutation]);

  useEffect(() => {
    if (gameInitMutation.data?.data?.sessionID) {
      navigate(`/game?s=${gameInitMutation.data.data.sessionID}`);
    }
  }, [gameInitMutation.data?.data?.sessionID, navigate]);

  return (
    <Box className={classnames("center", "wHeight")}>
      <Button onClick={initGame}>START</Button>
    </Box>
  );
};
