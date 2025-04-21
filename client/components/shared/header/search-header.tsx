import { Input } from "@/components/ui/input";
import React from "react";

export default function SearchHeader({
  query,
  placeholder,
}: {
  query: string;
  placeholder: string;
}) {
  return <Input placeholder={placeholder} />;
}
