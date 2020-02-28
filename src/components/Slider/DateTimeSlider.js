import React, { useState } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./SliderComponents";
import { subDays, startOfToday, format } from "date-fns";
import { scaleTime } from "d3-scale";

export const DateTimeSlider = (props) => {
    const sliderStyle = { position: "relative",
                          width: "100%"};

    const today = startOfToday();
    const fourDaysAgo = subDays(today, 4);
    const oneWeekAgo = subDays(today, 7);

    const [selected, setSelected] = useState(fourDaysAgo);
    const [updated, setUpdated] = useState(fourDaysAgo);
    const [min, setMin] = useState(oneWeekAgo);
    const [max, setMax] = useState(today);

    function formatTick(ms) {
      return format(new Date(ms), "MMM DD");
    }

    const halfHour = 1000 * 60 * 30;

    const onChange = ([ms]) => {
        if (isNaN(parseFloat(ms))) return;
        setSelected(new Date(ms))
    };

    const onUpdate = ([ms]) => {
        if (isNaN(parseFloat(ms))) return;
        setUpdated(new Date(ms))
        setMin(oneWeekAgo);
        setMax(today);
     };

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(8)
      .map(d => +d);

    const renderDateTime = (date, header) => {

      return (
        <div style={{ width: "100%",
                      textAlign: "center",
                      fontFamily: "Arial",
                      display: "flex",
                      margin: '5px 40px 0px 0px'}}>
          <b>{header}:</b>
          <div style={{ fontSize: 12,
                        margin: '3px 0px 0px 10px'
                       }}>{format(date, "YYYY MMM DD h:mm a")}</div>
        </div>
      );
    }

    //{renderDateTime(selected, "Selected")}

    return (
      <div>
        <span className="d-fl">
            {renderDateTime(updated, "Version")}
        </span>
        <div style={{ margin: "20px 0px 0px 0px", height: 90, width: "90%" }}>
          <Slider mode={1}
                  step={halfHour}
                  domain={[+min, +max]}
                  rootStyle={sliderStyle}
                  onUpdate={onUpdate}
                  onChange={onChange}
                  values={[+selected]}>
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle key={handle.id}
                            handle={handle}
                            domain={[+min, +max]}
                            getHandleProps={getHandleProps}/>))}
                </div>
              )}
            </Handles>
            <Tracks right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track key={id}
                           source={source}
                           target={target}
                           getTrackProps={getTrackProps}/>))}
                </div>
              )}
            </Tracks>
            <Ticks values={dateTicks}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick key={tick.id}
                          tick={tick}
                          count={ticks.length}
                          format={formatTick}/>
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      </div>
    );
}
