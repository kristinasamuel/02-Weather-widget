//  Weather Widgets Application
"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
//  Icons that we use in our card
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

// interace for the weather data
interface WeatherDataProps {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function WeatherWidgets() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherDataProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid loctaion");
      setWeather(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`);
      ;
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherDataProps = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("city not found try again later");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };
  //  function return the message related to temperature 
  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 10) {
        return `At ${temperature}°C, it's freezing out! Stay warm!`;
      } else if (temperature < 20) {
        return `It's quite cool at ${temperature}°C, Be sure to wear something warm`;

      }else if (temperature <25){
        return `the temerature is ${temperature}°C, Perfect for a light jacket!`;

      } else if(temperature<30){
        return `It's a wonderful ${temperature}°C, Enjoy the beautiful weather.`;

      } else {
        return `Its a hot at ${temperature}°C,Stay cool and hydrated`;
      }

    } else {
        return `${temperature}° ${unit}`
    }
  }
  // function return the output message related to the weather condition
  function getWeatherMessage(description:string):string{
    switch(description.toLowerCase()){
        case "sunny":
            return"Its a beautifull sunny day"
            case "partly cloudy":
      return "Expect some clouds and sunshine.";
    case "cloudy":
      return "The sky is full of clouds.";
    case "overcast":
      return "The sky is covered with clouds.";
    case "rain":
      return "Don't forget your umbrella! It's raining.";
    case "thunderstorm":
      return "Thunderstorms are expected today.";
    case "snow":
      return "Snowflakes are falling softly.";
    case "mist":
      return "It's a misty day with limited visibility..";
    case "fog":
      return "The fog is thick and visibility is low.";
    default:
      return description;
    }
  }
  //  return the message related to the location 
  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
  
    return ` ${location} ${isNight ? "(Night)" : "(Day)"}`;
  }
  //  return the card with specific color ,size and text 
  return (
<div className="flex justify-center items-center h-screen">
<Card className="md:w-full md:max-w-md mx-auto text-center border-4 bg-neutral-100 border-black">
        <CardHeader>
          <CardTitle >Weather Widget </CardTitle>
          <CardDescription
          className="md:text-xl italic "
          >
         Check out the current weather in your city
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
            className="md:text-lg border-2 border-black"
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-6 h-6" />
                {getTemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 " />
                <div>{getWeatherMessage(weather.description)}</div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 " />
                <div>{getLocationMessage(weather.location)}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
