/* eslint-disable jsx-a11y/label-has-associated-control */
import './Input.css';

type TextInputProps = Readonly<{
  'data-test-id'?: string;
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
}>;

function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  'data-test-id': dataTestId,
}: TextInputProps) {
  return (
    <div className="Input__wrapper">
      <label className="Input__label">{label}</label>
      <input
        type="text"
        className="Input__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        data-test-id={dataTestId}
      />
    </div>
  );
}

export default TextInput;
