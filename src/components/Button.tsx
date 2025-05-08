/**
 * Enum defining available button types.
 * Determines the visual style applied to the button.
 */
export enum ButtonType {
    /** Save button style, typically used for confirming actions. */
    Save = "save",
    /** Cancel button style, typically used for dismissing dialogs or reverting. */
    Cancel = "cancel",
    /** Red button, typically used for destructive actions such as deleting. */
    Destructive = "destructive"
}

type ButtonProps = {
    /** The text to display inside the button. */
    text: string;
    /** The type of button (determines styling). */
    type: ButtonType;
    /** Function to be called when the button is clicked. */
    onClick: () => void;
}

/**
 * A reusable Button component that supports different visual types.
 *
 * @param {ButtonProps} props - The props for the Button component.
 */
const Button = ({ text, type, onClick }: ButtonProps) => {
    const baseStyles =
        "px-4 py-2 rounded-md font-semibold transition button";

    const variantStyles = {
        [ButtonType.Save]: "button-save",
        [ButtonType.Cancel]: "button-close",
        [ButtonType.Destructive]: "button-destructive"
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${variantStyles[type]}`}>
            {text}
        </button>
    );
};

export default Button;
