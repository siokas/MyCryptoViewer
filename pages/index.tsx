import Head from "next/head";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";

const API_KEY = "0b52fcaa9a99943c7cfeca85bba5155e";
const CRYPTOS = ["ADA", "HOT", "VET"];
const API_URL = `https://api.nomics.com/v1/currencies/ticker?key=${API_KEY}&ids=${CRYPTOS}&interval=1m,30d&convert=EUR`;

export async function getServerSideProps() {
  return {
    props: {
      initialCrypto: ["ADA", "VET", "HOT"],
    },
  };
}

export default function Home() {
  const [crypto, setCrypto] = useState({
    logo_url: "",
    name: "",
    currency: "",
    price: "",
    market_cap: "",
    circulating_supply: "",
  });
  const [pointer, setPointer] = useState(0);
  const [data, setData] = useState([]);
  const [cycle, setCycle] = useState(0);

  async function fetchPrice() {
    console.log("start fetching price");

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }

  async function updatePointer() {
    if (pointer == 2) {
      setPointer(0);
    } else {
      setPointer(pointer + 1);
    }
    setCrypto(data[pointer]);
    setCycle(cycle + 1);

    if (cycle === 24) {
      await fetchPrice();
      setCycle(0);
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("update pointer");
      await updatePointer();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    fetchPrice();
  }, []);

  function currencyFormat(num) {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-3xl md:flex-row">
          <div className="pr-6">
            <img
              className="w-auto h-36 rounded-3xl"
              style={{ height: "150px" }}
              src={crypto.logo_url}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-xl font-medium">{crypto.name}</h2>
              <p className="text-base font-medium text-gray-400">
                {crypto.currency}
              </p>
            </div>
            <div className="flex items-center justify-center mt-4 md:justify-start text-3xl">
              € {crypto.price}
            </div>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-400">
              MarketCap: {currencyFormat(parseInt(crypto.market_cap))}
            </div>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-400">
              Circulating: {currencyFormat(parseInt(crypto.circulating_supply))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
