"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_PER_PERSON,
  KITCHEN_ITEMS_MULTIPLIER,
  SHOPPING_CONFIG_KEY,
} from "@/lib/data";

function buildDefaultConfig() {
  const config = {};
  KITCHEN_ITEMS_MULTIPLIER.forEach((item) => {
    config[item] = DEFAULT_PER_PERSON[item] ?? 2;
  });
  return config;
}

export function useShoppingConfig() {
  const [config, setConfig] = useState(buildDefaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(SHOPPING_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig({ ...buildDefaultConfig(), ...parsed });
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    localStorage.setItem(SHOPPING_CONFIG_KEY, JSON.stringify(config));
  }, [config, isLoaded]);

  const updatePerPerson = useCallback((item, value) => {
    setConfig((prev) => ({ ...prev, [item]: Math.max(0, value) }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(buildDefaultConfig());
  }, []);

  return { config, updatePerPerson, resetConfig, isLoaded };
}
