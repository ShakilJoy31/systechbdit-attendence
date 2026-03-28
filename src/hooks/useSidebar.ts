"use client";
import { onSidebarClose, showSidebarDrawer } from "@/redux/features/ui/sidebarSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./useRedux";


export default function useSidebar(): {
  isOpen: () => void;
  onClose: () => void;
  open: boolean;
} {
  const { open } = useAppSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  const isOpen = () => dispatch(showSidebarDrawer());

  const onClose = () => {
    dispatch(onSidebarClose());
  };

  return {
    isOpen,
    onClose,
    open,
  };
}