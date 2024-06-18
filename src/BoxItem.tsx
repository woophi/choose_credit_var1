import { Radio } from '@alfalab/core-components/radio';
import { Typography } from '@alfalab/core-components/typography';
import { useId } from 'react';
import { appSt } from './style.css';

type Props = {
  checked: (v: string) => boolean;
  setChecked: (v: string) => void;
  rate: number;
  period: number;
  payment: string;
  text: string;
};

export const BoxItem = ({ checked, setChecked, payment, period, rate, text }: Props) => {
  const id = useId();

  const boxValue = `${Number(payment.replace(/\s+/g, ''))};${text};${rate * 100}%;${period}мес`;
  return (
    <label htmlFor={id} className={appSt.card}>
      <div className={appSt.check}>
        <div>
          <Typography.Text tag="p" view="component" defaultMargins={false} weight="bold">
            {payment} ₽ / мес
          </Typography.Text>
          <Typography.Text tag="p" view="component-secondary" defaultMargins={false} color="secondary">
            {text}
          </Typography.Text>
        </div>
        <Radio id={id} checked={checked(boxValue)} name="boxes" onChange={() => setChecked(boxValue)} />
      </div>

      <div className={appSt.tag}>
        <Typography.Text tag="p" view="primary-small" defaultMargins={false}>
          {rate * 100} % годовых <span style={{ color: '#EDEEF0' }}>|</span> {period} мес
        </Typography.Text>
      </div>
    </label>
  );
};
