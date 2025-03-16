import styles from "./CalculationPopup.module.scss";
import { FC, useActionState, useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import * as React from "react";

interface CalculationPopupProps {
  handleClose: () => void;
}

function formatNumber(number: number): string {
  return number.toLocaleString("en-US").replace(/,/g, " ");
}

const monthsAmount = [12, 24, 36, 48];
const paymentPeriod = ["в год", "в месяц"];
const textWidthOffset = 20;

const CalculationPopup: FC<CalculationPopupProps> = ({ handleClose }) => {
  const [inputAmount, setInputAmount] = useState("");
  const [textWidth, setTextWidth] = useState(0);
  console.log(textWidth);

  const [creditAmount, setCreditAmount] = useState("");

  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [currentPaymentPeriodIdx, setCurrentPaymentPeriodIdx] = useState(1);

  const popupContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [submitState, formAction] = useActionState<undefined>(submitAction, undefined);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    // Reset data
    setCreditAmount("");
    setCurrentPaymentPeriodIdx(1);

    // Main logic
    const { value } = e.target;
    const formattedVal = formatNumber(Number(value.replace(/[^0-9]/g, "")));

    setInputAmount(formattedVal);

    // Setting "₽" left position
    if (inputRef.current) {
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.font = window.getComputedStyle(inputRef.current).font;

      tempSpan.textContent = formattedVal;
      document.body.appendChild(tempSpan);

      const inputWidth = inputRef.current.getBoundingClientRect().width;
      setTextWidth(Math.min(tempSpan.offsetWidth + textWidthOffset, inputWidth - textWidthOffset));
      document.body.removeChild(tempSpan);
    }
  }

  function submitAction(): undefined {
    setCreditAmount(inputAmount);
  }

  function calcPaymentAmount(): string {
    const numericCredit = Number(creditAmount.replace(/[^0-9]/g, ""));

    let val = numericCredit / monthsAmount[currentMonthIdx];

    if (currentPaymentPeriodIdx === 0) {
      val *= 12;
    }

    return formatNumber(val);
  }

  // Handle popup closure
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupContentRef.current) {
        if (!popupContentRef.current.contains(e.target as Node)) {
          handleClose();
        }
      }
    }

    function handleEscClick(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscClick);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscClick);
    };
  }, []);

  return (
    <div className={styles.popup_container}>
      <div
        ref={popupContentRef}
        className={styles.popup_content}
      >
        <FaXmark
          className={styles.close_icon}
          onClick={handleClose}
        />
        <p className={styles.title}>Платежи по кредиту</p>
        <p className={styles.help_info}>
          Введите сумму кредита и выберите срок, на который вы хотите
          его оформить.
          <br />
          Мы автоматически рассчитаем для вас ежемесячный платеж,
          чтобы вы могли лучше спланировать свои финансы.
        </p>

        <form className={styles.form}>
          <label
            htmlFor="amount"
            className={styles.label}
          >
            Ваша сумма кредита
          </label>
          <div className={styles.input_container}>
            <input
              ref={inputRef}
              type="text"
              id="amount"
              placeholder="Введите данные"
              value={inputAmount}
              onChange={handleInputChange}
              className={styles.amount_input}
            />
            {inputAmount && (
              <p
                style={{ left: `${textWidth}px` }}
                className={styles.currency_label}
              >₽
              </p>
            )}
          </div>
          <button
            formAction={formAction}
            className={styles.submit_button}
          >
            Рассчитать
          </button>
        </form>

        <div className={styles.months_selector_container}>
          <p className={styles.label}>Количество месяцев?</p>
          <div className={styles.options}>
            {monthsAmount.map((m, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentMonthIdx(idx)}
                className={`${styles.option} ${idx === currentMonthIdx && styles.current_option}`}
              >
                {m}
              </div>
            ))}
          </div>
        </div>

        {creditAmount && (
          <div className={styles.total_container}>
            <p className={styles.label}>
              Итого ваш платеж по кредиту:
            </p>
            <div className={styles.options}>
              {paymentPeriod.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentPaymentPeriodIdx(idx)}
                  className={`${styles.option} ${idx === currentPaymentPeriodIdx && styles.current_option}`}
                >
                  {p}
                </div>
              ))}
            </div>
            <p className={styles.payment_amount}>{calcPaymentAmount()} рублей</p>
          </div>
        )}

        <button
          className={styles.add_button}
          onClick={handleClose}
        >
          <p style={{ position: "relative", zIndex: 2 }}>
            Добавить
          </p>
        </button>
      </div>
    </div>
  );
};

export default CalculationPopup;