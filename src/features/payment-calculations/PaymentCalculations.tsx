import styles from "./PaymentCalculations.module.scss";
import { FC } from "react";

const PaymentCalculations: FC = () => {
  return (
    <main className={styles.main_section}>
      <div className={styles.content}>
        <button className={styles.calc_button}>Расчет платежей</button>
      </div>
    </main>
  );
};

export default PaymentCalculations;