import React, { useState } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./SliderComponents";
import { subDays, startOfToday, format, startOfDay } from "date-fns";
import { scaleTime } from "d3-scale";
import { getQuery } from "../../utils/queryList"
import { hooks } from "../../hooks"

export const DateTimeSlider = (props) => {
    const today = startOfToday();
    const fourDaysAgo = subDays(today, 4);
    const oneWeekAgo = subDays(today, 7);
    const setReturnSelected = props.setSelected;

    const hMin = props.min.Time || oneWeekAgo;
    const formattedHMin = startOfDay(new Date(props.min.Time * 1000));

    const [selected, setSelected] = useState(today);
    const [updated, setUpdated] = useState(today);
    const [min, setMin] = useState(formattedHMin);
    const [max, setMax] = useState(today);

    const sliderStyle = {position: "relative",
                         width: "100%"};

    function formatTick(ms) {
      return format(new Date(ms), "dd MMM yyyy");
    }

    //const halfHour = 1000 * 60 * 30;

    const onChange = ([ms]) => {
        if (isNaN(parseFloat(ms))) return;
        setSelected(new Date(ms))
    };

    const onUpdate = ([ms]) => {
        if (isNaN(parseFloat(ms))) return;
        setUpdated(new Date(ms))
        setReturnSelected(new Date(ms))
        setMin(formattedHMin);
        setMax(today);
     };

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks()
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
                    }}>{format(date, "dd MMM yyyy h:mm:sss a")}</div>
        </div>
      );
    }

    return (
      <div>
        <span className="d-fl">
            {renderDateTime(updated, "Version")}
        </span>
        <div style={{ margin: "20px 0px 0px 0px", height: 90, width: "90%" }}>
          <Slider mode={1}
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
        {/*<div style={{ margin: "20px 0px 0px 0px", height: 90, width: "90%" }}>
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
        </div>*/}
      </div>
    );
}
