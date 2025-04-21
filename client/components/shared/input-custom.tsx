import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

export default function InputCustom({
  placeholder,
  isPassword,
  ...props
}: any) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      {isPassword ? (
        <div className="flex justify-between gap-2">
          <Input
            {...props}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
          />
          <Button
            size="sm"
            variant="link"
            className={"text-sm px-0"}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
      ) : (
        <Input {...props} placeholder={placeholder} type="text" />
      )}
    </>
  );
}
