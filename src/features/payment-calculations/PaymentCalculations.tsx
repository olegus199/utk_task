import styles from "./PaymentCalculations.module.scss";
import { FC, useState } from "react";
import CalculationPopup from "./CalculationPopup.tsx";

const PaymentCalculations: FC = () => {
  const [popupVisible, setPopupVisible] = useState(true);

  function handlePopupClose(): void {
    setPopupVisible(false);
  }

  return (
    <main className={styles.main_section}>
      <button
        onClick={() => setPopupVisible(true)}
        className={styles.calc_button}
      >
        Расчет платежей
      </button>
      {popupVisible && <CalculationPopup handleClose={handlePopupClose} />}
    </main>
  );
};

export default PaymentCalculations;