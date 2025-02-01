import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "@/store/user/userSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { unwrapResult } from "@reduxjs/toolkit";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isSignedIn = useSelector((state: RootState) => state.user.isSignedIn);
  const userStatus = useSelector((state: RootState) => state.user.status);

  useEffect(() => {
    if (!isSignedIn && userStatus !== "loading") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(fetchUser() as any)
        .then(unwrapResult)
        .catch(() => {
          console.log("Redirecting to login due to failed authentication...");
          router.push("/login");
        });
    }
  }, [isSignedIn, userStatus, dispatch, router]);

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
};

export default WithAuth;
