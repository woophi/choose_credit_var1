declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
export const sendDataToGA = async (item: string) => {
  try {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await fetch(
      'https://script.google.com/macros/s/AKfycbweSx_2_ZVpwJ4SNHvg9hk6pLUW_QJgXCsFYy5jAvlRrsW7FEKnD5k9r9f_tqPDd4pb9w/exec',
      {
        redirect: 'follow',
        method: 'POST',
        body: JSON.stringify({ date, button: item, variant: 'variant_1' }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      },
    );
  } catch (error) {
    console.error('Error!', error);
  }
};
