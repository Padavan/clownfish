import { ErrorMessage } from "component/errormessage";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useData } from "providers/data.provider";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { ROUTES } from "routes";
import { hClock } from "utils/hlc";
import { Strategy } from "utils/series.types";
import { DATE_FORMAT, getDateString } from "utils/utils";

const today = dayjs().format(DATE_FORMAT);

export function NewSeriesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [strategy, setStrategy] = useState<Strategy>(Strategy.FIBONACCI);

  const history = useHistory();
  const { createNewSeries } = useData();

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setError(null);
  }, [name, description, startDate, strategy]);

  const handleCancel = () => {
    history.push(ROUTES.AGENDA);
  };

  const handleFormSubmit = async () => {
    const newSeries = {
      id: nanoid(),
      name: name,
      description: description,
      startDate: startDate,
      strategy: strategy,
      hlc: hClock.next(),
    };

    if (name && startDate && strategy) {
      await createNewSeries(newSeries);
      history.push(ROUTES.AGENDA);
    } else {
      setError("Not all requiered fields are filed");
    }
  };

  return (
    <main>
      <h2>Add new series</h2>
      <label htmlFor="name">
        Name
        <input
          id="name"
          name="name"
          required
          placeholder="Name of series"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label htmlFor="description">
        Description
        <input
          id="description"
          placeholder="Add a note"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label htmlFor="startDate">
        Start date
        <input
          id="startDate"
          type="date"
          name="startDate"
          min={today}
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      <fieldset>
        <legend>Spacing strategy</legend>
        <label>
          <input
            type="radio"
            name="strategy"
            value="fibonacci"
            checked={strategy === Strategy.FIBONACCI}
            onChange={(e) => setStrategy(e.target.value as Strategy)}
          />
          Fibonacci
        </label>
        <label>
          <input
            type="radio"
            name="strategy"
            value="doubling"
            checked={strategy === Strategy.DOUBLING}
            onChange={(e) => setStrategy(e.target.value as Strategy)}
          />
          Doubling
        </label>
        <label>
          <input
            type="radio"
            name="strategy"
            value="sm2"
            checked={strategy === Strategy.SM2}
            onChange={(e) => setStrategy(e.target.value as Strategy)}
          />
          SM-2
        </label>
      </fieldset>

      <label>
        Preview
        <article>TODO</article>
      </label>

      <ErrorMessage message={error} />

      <div className="hflex">
        <button className="outline" onClick={handleCancel}>
          Cancel
        </button>
        <button onClick={handleFormSubmit} disabled={!name || !startDate || !strategy}>
          Create series
        </button>
      </div>
    </main>
  );
}
