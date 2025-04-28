import { Input } from "../ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputCustom({
  placeholder,
  isPassword,
  type,
  ...props
}: any) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      {isPassword ? (
        <div className="relative">
          <Input
            {...props}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </div>
        </div>
      ) : (
        <Input {...props} placeholder={placeholder} type={type} />
      )}
    </>
  );
}
