export const currentcyFormat = (num) => {
    return (
        Number(num)
          .toFixed(0)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + " đ"
      );
}