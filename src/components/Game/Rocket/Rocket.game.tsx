import { FC } from "react";

import styles from "./Rocket.game.module.scss";
import { Box } from "../../Layout";
import classnames from "classnames";

type Props = {
  state: "FLYING" | "BOOM";
};

export const RocketGame: FC<Props> = ({ state }) => {
  return (
    <Box
      className={classnames(styles.main, {
        [styles.flying]: state === "FLYING",
        [styles.boom]: state === "BOOM",
      })}
    />
  );
};
