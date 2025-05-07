import { FC } from "react";

export enum ButtonType {
    Save = "save",
    Cancel = "cancel",
}

interface ButtonProps {
    text: string;
    type: ButtonType;
    onClick: () => void;
}

const Button: FC<ButtonProps> = ({ text, type, onClick }) => {
    const baseStyles =
        "px-4 py-2 rounded-md font-semibold text-white focus:outline-none transition";

    const variantStyles = {
        [ButtonType.Save]: "bg-green-600 hover:bg-green-700",
        [ButtonType.Cancel]: "bg-gray-500 hover:bg-gray-600",
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${variantStyles[type]}`}>
            {text}
        </button>
    );
};

export default Button;
