"use client";

import { useState, useEffect, useCallback } from "react";
import { loadData, saveData, buildInitialData } from "@/lib/storage";

export function useApartmentData() {
  const [data, setData] = useState(() => buildInitialData());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveData(data);
  }, [data, isLoaded]);

  const updateField = useCallback((aptName, field, value) => {
    setData((prev) => ({
      ...prev,
      [aptName]: {
        ...(prev[aptName] || {}),
        [field]: value,
        lastChecked: Date.now(),
      },
    }));
  }, []);

  const updateCheck = useCallback((aptName, item, status, note) => {
    setData((prev) => {
      const current = prev[aptName] || {};
      const checks = current.checks || {};
      const existing = checks[item] || {};
      return {
        ...prev,
        [aptName]: {
          ...current,
          checks: {
            ...checks,
            [item]: {
              status,
              note: note !== undefined ? note : existing.note || "",
            },
          },
          lastChecked: Date.now(),
        },
      };
    });
  }, []);

  const toggleExitCheck = useCallback((aptName, item) => {
    setData((prev) => {
      const current = prev[aptName] || {};
      const exitChecks = current.exitChecks || {};
      return {
        ...prev,
        [aptName]: {
          ...current,
          exitChecks: { ...exitChecks, [item]: !exitChecks[item] },
          lastChecked: Date.now(),
        },
      };
    });
  }, []);

  const addPhoto = useCallback((aptName, dataUrl) => {
    setData((prev) => {
      const current = prev[aptName] || {};
      const photos = current.photos || [];
      return {
        ...prev,
        [aptName]: {
          ...current,
          photos: [...photos, dataUrl],
          lastChecked: Date.now(),
        },
      };
    });
  }, []);

  const removePhoto = useCallback((aptName, index) => {
    setData((prev) => {
      const current = prev[aptName] || {};
      const photos = current.photos || [];
      return {
        ...prev,
        [aptName]: {
          ...current,
          photos: photos.filter((_, i) => i !== index),
          lastChecked: Date.now(),
        },
      };
    });
  }, []);

  const replaceAllData = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    data,
    isLoaded,
    updateField,
    updateCheck,
    toggleExitCheck,
    addPhoto,
    removePhoto,
    replaceAllData,
  };
}
