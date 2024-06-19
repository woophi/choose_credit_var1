import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { CDNIcon } from '@alfalab/core-components/cdn-icon';
import { Collapse } from '@alfalab/core-components/collapse';
import { Gap } from '@alfalab/core-components/gap';
import { SliderInput, SliderInputProps } from '@alfalab/core-components/slider-input';
import { Typography } from '@alfalab/core-components/typography';
import { useCallback, useEffect, useState } from 'react';
import { BoxItem } from './BoxItem';
import { appSt } from './style.css';
import { sendDataToGA } from './utils/events';

const min = 30_000;
const max = 2_100_000;
const step = 10_000;
const range: SliderInputProps['range'] = {
  min: [min],
  max: [max],
};
const pips: SliderInputProps['pips'] = {
  mode: 'values',
  values: [min, max],
  format: {
    to: (value: number) => {
      return `${value.toLocaleString('ru')} ₽`;
    },
  },
};

const KN_PERIODS = [13, 18, 24, 36, 48, 60];
const KPZN_PERIODS = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];
const KCAR_PERIODS = [36, 48, 60, 72, 84, 96];

const KN_END_LIMIT = 1_300_000;
const KPZN_START_LIMIT = 500_000;
const KCAR_START_LIMIT = 300_000;
const KCAR_END_LIMIT = 1_500_000;

function calculatePayment(principal: number, interestRate: number, term: number) {
  const monthlyInterestRate = interestRate / 12;
  const exponent = Math.pow(1 + monthlyInterestRate, term);

  return (principal * monthlyInterestRate * exponent) / (exponent - 1);
}

function findNearestValue(arr: number[], target: number) {
  return arr.reduce((prev, curr) => (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev));
}

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number | string>(KPZN_START_LIMIT);
  const [expanded, setExpanded] = useState(false);
  const [checkedBox, setChecked] = useState<string>('');
  const [err, setError] = useState('');

  const numberValue = typeof value === 'string' ? Number(value.replace(/\s+/g, '')) : value;
  const isDataForKpzn = numberValue > KN_END_LIMIT;

  const pipsValuesMonthlyPayment = (isDataForKpzn ? KPZN_PERIODS : KN_PERIODS)
    .map(period => Number(calculatePayment(numberValue, isDataForKpzn ? 0.22 : 0.29, period).toFixed(0)))
    .sort((a, b) => a - b);

  const [monthlyValue, setMonthlyValue] = useState<number | string>(
    Number(calculatePayment(numberValue, 0.29, 36).toFixed(0)),
  );

  const monthlyNumberValue = typeof monthlyValue === 'string' ? Number(monthlyValue.replace(/\s+/g, '')) : monthlyValue;

  const pipsValuesPeriod = (isDataForKpzn ? KPZN_PERIODS : KN_PERIODS).sort((a, b) => b - a);
  const [periodValue, setPeriodValue] = useState<number>(36);

  useEffect(() => {
    setMonthlyValue(pipsValuesMonthlyPayment[0]);
    setChecked('');
  }, [numberValue]);

  useEffect(() => {
    const index = pipsValuesMonthlyPayment.indexOf(monthlyNumberValue);
    setPeriodValue(pipsValuesPeriod[index === -1 ? 0 : index]);
  }, [monthlyNumberValue]);

  useEffect(() => {
    const index = pipsValuesPeriod.indexOf(periodValue);

    setMonthlyValue(pipsValuesMonthlyPayment[index === -1 ? 0 : index]);
  }, [periodValue]);

  const handleInputChange: SliderInputProps['onInputChange'] = (_, { value }) => {
    setValue(typeof value === 'string' ? Number(value.replace(/\s+/g, '')) : value);
  };

  const handleSliderChange: SliderInputProps['onSliderChange'] = ({ value }) => {
    setValue(value);
  };

  const handleBlur = () => {
    setValue(Math.max(min, Math.min(max, numberValue)));
  };

  const handleMInputChange: SliderInputProps['onInputChange'] = (_, { value }) => {
    setMonthlyValue(typeof value === 'string' ? Number(value.replace(/\s+/g, '')) : value);
  };

  const handleMSliderChange: SliderInputProps['onSliderChange'] = ({ value }) => {
    setMonthlyValue(findNearestValue(pipsValuesMonthlyPayment, value));
  };

  const handleMBlur = () => {
    setMonthlyValue(
      findNearestValue(
        pipsValuesMonthlyPayment,
        Math.max(
          pipsValuesMonthlyPayment[0],
          Math.min(pipsValuesMonthlyPayment[pipsValuesMonthlyPayment.length - 1], monthlyNumberValue),
        ),
      ),
    );
  };
  const handlePInputChange: SliderInputProps['onInputChange'] = (_, { value }) => {
    setPeriodValue(value === '' ? pipsValuesPeriod[0] : value);
  };

  const handlePSliderChange: SliderInputProps['onSliderChange'] = ({ value }) => {
    setPeriodValue(findNearestValue(pipsValuesPeriod, value));
  };

  const handlePBlur = () => {
    setPeriodValue(
      findNearestValue(
        pipsValuesPeriod,
        Math.max(pipsValuesPeriod[pipsValuesPeriod.length - 1], Math.min(pipsValuesPeriod[0], periodValue)),
      ),
    );
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const submit = () => {
    if (!checkedBox) {
      setError('Выберите предложение');
      return;
    }
    setLoading(true);
    sendDataToGA({
      creditPeriod: periodValue,
      creditSum: numberValue,
      overpaymentSum: monthlyNumberValue * periodValue - numberValue,
      paymentSum: monthlyNumberValue,
      offer: checkedBox,
    }).then(() => {
      setLoading(false);

      (window.location as unknown as string) =
        'alfabank://webFeature?type=recommendation&url=https%3A%2F%2Fclick.alfabank.ru%2Fmobile-offers%2Fweb%2FPIL%2Fcredits%2FCH?isWebView=true';
    });
  };

  const onSelectOption = useCallback((v: string) => {
    setError('');
    setChecked(v);
  }, []);

  return (
    <>
      <div className={appSt.container}>
        <Typography.TitleResponsive font="system" tag="h1" view="small" weight="medium">
          Выберите свои условия кредита
        </Typography.TitleResponsive>
        <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
          Настройте параметры кредита, а мы подберем для вас предложения
        </Typography.Text>
        <SliderInput
          block
          value={value.toLocaleString('ru')}
          sliderValue={numberValue}
          onInputChange={handleInputChange}
          onSliderChange={handleSliderChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          range={range}
          pips={pips}
          step={step}
          size={56}
          rightAddons="₽"
          fieldClassName={appSt.slider}
          sliderClassName={appSt.slid}
          label="Сумма кредита"
          labelView="outer"
        />
        <SliderInput
          block
          value={monthlyValue.toLocaleString('ru')}
          sliderValue={monthlyNumberValue}
          onInputChange={handleMInputChange}
          onSliderChange={handleMSliderChange}
          onBlur={handleMBlur}
          min={pipsValuesMonthlyPayment[0]}
          max={pipsValuesMonthlyPayment[pipsValuesMonthlyPayment.length - 1]}
          range={{
            min: [pipsValuesMonthlyPayment[0]],
            max: [pipsValuesMonthlyPayment[pipsValuesMonthlyPayment.length - 1]],
          }}
          pips={{
            mode: 'range',
            values: pipsValuesMonthlyPayment,
            format: {
              to: (v: number) => {
                return `${v.toLocaleString('ru')} ₽`;
              },
            },
          }}
          size={56}
          rightAddons="₽"
          fieldClassName={appSt.slider}
          sliderClassName={appSt.slid}
          label="Платёж"
          labelView="outer"
        />
        <Collapse expanded={expanded}>
          <SliderInput
            block
            value={periodValue}
            sliderValue={periodValue}
            onInputChange={handlePInputChange}
            onSliderChange={handlePSliderChange}
            onBlur={handlePBlur}
            max={pipsValuesPeriod[0]}
            min={pipsValuesPeriod[pipsValuesPeriod.length - 1]}
            range={{
              max: [pipsValuesPeriod[0]],
              min: [pipsValuesPeriod[pipsValuesPeriod.length - 1]],
            }}
            pips={{
              mode: 'range',
              values: pipsValuesPeriod,
              format: {
                to: (v: number) => {
                  return `${v} мес`;
                },
              },
            }}
            size={56}
            rightAddons="мес"
            fieldClassName={appSt.slider}
            sliderClassName={appSt.slid}
            label="Срок"
            labelView="outer"
          />
          <Gap size={16} />

          <div className={appSt.moneyCard}>
            <Typography.Text tag="p" view="primary-small" defaultMargins={false} style={{ color: '#3C3C43A8' }}>
              Переплата за весь срок
            </Typography.Text>
            <Typography.Text weight="bold" tag="p" view="primary-medium" defaultMargins={false}>
              {(monthlyNumberValue * periodValue - numberValue).toLocaleString('ru')} ₽
            </Typography.Text>
          </div>
        </Collapse>
        <div onClick={handleToggle} className={appSt.collapseAction}>
          <Typography.Text tag="p" defaultMargins={false}>
            {expanded ? 'Свернуть' : 'Все условия'}
          </Typography.Text>
          <CDNIcon color="#C1C1C3" name="glyph_chevron-down_m" className={appSt.collapseArrow({ open: expanded })} />
        </div>
        <Gap size={1} />
        <Typography.TitleResponsive font="system" tag="h2" view="xsmall" weight="medium">
          Выберите предложение
        </Typography.TitleResponsive>
        <BoxItem
          payment={monthlyNumberValue.toLocaleString('ru')}
          period={periodValue}
          rate={isDataForKpzn ? 0.18 : 0.23}
          checked={boxValue => checkedBox === boxValue}
          setChecked={onSelectOption}
          text={isDataForKpzn ? 'Понадобится недвижимость в залог' : 'Онлайн одобрение за 2 минуты'}
        />
        {numberValue >= KPZN_START_LIMIT && KPZN_PERIODS.includes(periodValue) && !isDataForKpzn && (
          <BoxItem
            payment={Number(calculatePayment(numberValue, 0.22, periodValue).toFixed(0)).toLocaleString('ru')}
            period={periodValue}
            rate={0.18}
            checked={boxValue => checkedBox === boxValue}
            setChecked={onSelectOption}
            text={'Понадобится недвижимость в залог'}
          />
        )}
        {KCAR_START_LIMIT <= numberValue && numberValue <= KCAR_END_LIMIT && KCAR_PERIODS.includes(periodValue) ? (
          <BoxItem
            payment={Number(calculatePayment(numberValue, 0.28, periodValue).toFixed(0)).toLocaleString('ru')}
            period={periodValue}
            rate={0.16}
            checked={boxValue => checkedBox === boxValue}
            setChecked={onSelectOption}
            text="Кредит на автомобиль"
          />
        ) : null}
        {pipsValuesPeriod[0] !== periodValue ? (
          <>
            <BoxItem
              payment={Number(
                calculatePayment(numberValue, isDataForKpzn ? 0.22 : 0.29, pipsValuesPeriod[0]).toFixed(0),
              ).toLocaleString('ru')}
              period={pipsValuesPeriod[0]}
              rate={isDataForKpzn ? 0.18 : 0.23}
              checked={boxValue => checkedBox === boxValue}
              setChecked={onSelectOption}
              text={
                isDataForKpzn
                  ? 'Кредит под залог недвижимости на максимальный срок'
                  : 'Кредит наличными на максимальный срок'
              }
            />
          </>
        ) : null}
        {numberValue >= KPZN_START_LIMIT && !isDataForKpzn && (
          <BoxItem
            payment={Number(calculatePayment(numberValue, 0.22, 120).toFixed(0)).toLocaleString('ru')}
            period={120}
            rate={0.18}
            checked={boxValue => checkedBox === boxValue}
            setChecked={onSelectOption}
            text={'Понадобится недвижимость в залог'}
          />
        )}
      </div>
      <Gap size={96} />
      <div className={appSt.bottomBtn}>
        <ButtonMobile loading={loading} block view="primary" onClick={submit} hint={err} className={appSt.hint}>
          Продолжить
        </ButtonMobile>
      </div>
    </>
  );
};
