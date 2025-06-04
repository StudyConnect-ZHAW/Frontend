/**
 * Enum defining available button visual variants.
 */
export enum ButtonVariant {
  /** Used for primary actions like submitting or saving. */
  Primary = "primary",
  /** Used for secondary actions or neutral alternatives. */
  Secondary = "secondary",
  /** Used for cancel/close actions. */
  Ghost = "ghost",
  /** Used for dangerous actions like deletion. */
  Danger = "danger",
}

type ButtonProps = {
  /** The text to display inside the button. */
  text: string;
  /** The type of button (determines styling). */
  type: ButtonVariant;
  /** Function to be called when the button is clicked. */
  onClick: () => void;
  /** Disables the button and applies a faded style */
  disabled?: boolean;
};

/**
 * A reusable Button component that supports different visual types.
 *
 * @param {ButtonProps} props - The props for the Button component.
 */
const Button = ({ text, type, onClick, disabled = false }: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold transition button";

  /** Apply CSS for each button variant from globals.css */
  const variantStyles = {
    [ButtonVariant.Primary]: "button-primary",
    [ButtonVariant.Secondary]: "button-secondary",
    [ButtonVariant.Ghost]: "button-ghost",
    [ButtonVariant.Danger]: "button-danger",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[type]} ${disabledStyles}`}
    >
      {text}
    </button>
  );
};

export default Button;
