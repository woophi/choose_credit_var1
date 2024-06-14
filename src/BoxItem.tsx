import { Radio } from '@alfalab/core-components/radio';
import { Typography } from '@alfalab/core-components/typography';
import { useId } from 'react';
import { appSt } from './style.css';

type Props = {
  checked: boolean;
  setChecked: (v: number) => void;
  rate: number;
  period: number;
  payment: string;
};

export const BoxItem = ({ checked, setChecked, payment, period, rate }: Props) => {
  const id = useId();

  return (
    <label htmlFor={id} className={appSt.card}>
      <div className={appSt.check}>
        <div>
          <Typography.Text tag="p" view="component" defaultMargins={false} weight="bold">
            {payment} ₽ / мес
          </Typography.Text>
          <Typography.Text tag="p" view="component-secondary" defaultMargins={false} color="secondary">
            Онлайн одобрение за 2 минуты
          </Typography.Text>
        </div>
        <Radio id={id} checked={checked} name="boxes" onChange={() => setChecked(period)} />
      </div>

      <div className={appSt.tag}>
        <Typography.Text tag="p" view="primary-small" defaultMargins={false}>
          {rate * 100} % годовых <span style={{ color: '#EDEEF0' }}>|</span> {period} мес
        </Typography.Text>
      </div>
    </label>
  );
};
