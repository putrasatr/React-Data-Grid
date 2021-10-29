import "./App.css";
// import MyApp from "./components";

function App() {
  const arr = new Array(10).fill(3);
  return (
    <>
      {arr.map((item, i) => (
        <div key={i}>{item + Math.random().toString(36)}</div>
      ))}
    </>
  );
}
// const caraKirimOpt = [
//   { value: 0, title: "Standar Http Get" },
//   { value: 1, title: "Trugee" },
//   { value: 2, title: "Fast Pay" },
//   { value: 3, title: "Telesindo" },
//   { value: 4, title: "Serpul" },
//   { value: 5, title: "Data Cell" },
//   { value: 6, title: "Standar Http Get" },
//   { value: 7, title: "Eratel" },
//   { value: 8, title: "FM" },
//   { value: 9, title: "JTL" },
//   { value: 10, title: "BRI" },
//   { value: 11, title: "VRE" },
//   { value: 12, title: "AXS" },
//   { value: 13, title: "QPay" },
//   { value: 14, title: "Roket" },
//   { value: 15, title: "Ciwaru" },
//   { value: 16, title: "ICG" },
//   { value: 17, title: "QPay-Devel" },
//   { value: 18, title: "IRS" },
//   { value: 19, title: "XMLPost" },
//   { value: 20, title: "IRS Market" },
//   { value: 21, title: "New QPay" },
//   { value: 22, title: "NRD" },
//   { value: 23, title: "TSEL-Digipos" },
//   { value: 24, title: "TSEL-NGRS" },
//   { value: 25, title: "XL-Sidompul" },
//   { value: 26, title: "XL-IDEXPRO" },
//   { value: 27, title: "ISAT-MOBO" },
//   { value: 28, title: "Griya Bayar" },
//   { value: 29, title: "MITRA TOKOPEDIA" },
//   { value: 30, title: "MITRA BUKALAPAK" },
// ];

export default App;
