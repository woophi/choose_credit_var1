import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { CDNIcon } from '@alfalab/core-components/cdn-icon';
import { Collapse } from '@alfalab/core-components/collapse';
import { Gap } from '@alfalab/core-components/gap';
import { SliderInput, SliderInputProps } from '@alfalab/core-components/slider-input';
import { Typography } from '@alfalab/core-components/typography';
import { useCallback, useEffect, useState } from 'react';
import { BoxItem } from './BoxItem';
import { default as fisrtData } from './data/kn_group1_result.json';
import { default as secondData } from './data/kpzn_group1_result.json';
import { appSt } from './style.css';

const min = 30_000;
const max = 1_600_000;
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

// function calculatePayment(
//   principal: number,
//   interestRate: number,
//   term: number
// ) {
//   const monthlyInterestRate = interestRate / 12;
//   const exponent = Math.pow(1 + monthlyInterestRate, term);

//   return (principal * monthlyInterestRate * exponent) / (exponent - 1);
// }

function findNearestValue(arr: number[], target: number) {
  return arr.reduce((prev, curr) => (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev));
}

export const App = () => {
  const [value, setValue] = useState<number | string>(min);
  const [expanded, setExpanded] = useState(false);
  const [checkedBox, setChecked] = useState(0);
  const [err, setError] = useState('');

  const numberValue = typeof value === 'string' ? Number(value.replace(/ /g, '')) : value;
  const dataset =
    numberValue <= 700_000
      ? fisrtData[`${numberValue as unknown as keyof typeof fisrtData}`] ?? fisrtData[30000]
      : secondData[`${numberValue as unknown as keyof typeof secondData}`] ?? secondData[700000];

  const pipsValuesMonthlyPayment = dataset.map(v => Number(v.value.toFixed(0))).sort((a, b) => a - b);

  const [monthlyValue, setMonthlyValue] = useState<number | string>(pipsValuesMonthlyPayment[0]);

  const monthlyNumberValue = typeof monthlyValue === 'string' ? Number(monthlyValue.replace(/ /g, '')) : monthlyValue;

  const pipsValuesPeriod = dataset.map(v => v.period).sort((a, b) => b - a);
  const [periodValue, setPeriodValue] = useState<number>(pipsValuesPeriod[0]);

  useEffect(() => {
    setMonthlyValue(pipsValuesMonthlyPayment[0]);
    setChecked(0);
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
    setValue(typeof value === 'string' ? Number(value.replace(/ /g, '')) : value);
  };

  const handleSliderChange: SliderInputProps['onSliderChange'] = ({ value }) => {
    setValue(value);
  };

  const handleBlur = () => {
    setValue(Math.max(min, Math.min(max, numberValue)));
  };

  const handleMInputChange: SliderInputProps['onInputChange'] = (_, { value }) => {
    setMonthlyValue(typeof value === 'string' ? Number(value.replace(/ /g, '')) : value);
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

  const submit = useCallback(() => {
    if (!checkedBox) {
      setError('Выберите предложение');
      return;
    }
  }, [checkedBox]);

  const onSelectOption = useCallback((v: number) => {
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

        {dataset.reverse().map(v => (
          <BoxItem
            key={v.period}
            payment={Number(v.value.toFixed(0)).toLocaleString('ru')}
            period={v.period}
            rate={v.rate === 0.36 ? 0.2 : 0.17}
            checked={checkedBox === v.period}
            setChecked={onSelectOption}
          />
        ))}
      </div>
      <Gap size={96} />
      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="primary" onClick={submit} hint={err}>
          Продолжить
        </ButtonMobile>
      </div>
    </>
  );
};
