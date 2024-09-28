import { FC } from "react";

import { Outlet } from "react-router-dom";

type Props = NonNullable<unknown>;

export const RootPage: FC<Props> = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
