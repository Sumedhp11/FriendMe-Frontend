import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message) || "Something Went Wrong";
      }
    });
  }, [errors]);
};

const useAsyncMutations = (mutationHook) => {
  const [isLoading, setisLoading] = useState(false);
  const [mutate] = mutationHook();
  const [data, setData] = useState(null);

  const executemutation = async (toastMessage, ...args) => {
    setisLoading(true);
    const toastId = toast.loading(toastMessage || "Updating Data...");

    try {
      const res = await mutate(...args);
      if (res.data) {
        toast.success(res.data?.message || "Data updated Successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something Went Wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something Went Wrong", { id: toastId });
    } finally {
      setisLoading(false);
    }
  };
  return [executemutation, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutations, useSocketEvents };
