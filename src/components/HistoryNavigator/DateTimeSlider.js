import React, { useState, useEffect } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./SliderComponents";
import { scaleTime } from "d3-scale";
import {printts, DATETIME_YEAR, DATETIME_YY, DATETIME_YEAR_MONTH, DATETIME_COMPLETE,
    DATETIME_DD_MM, DATETIME_HOUR, DATETIME_HHMM, DATETIME_SS, DATETIME_SSS, DATETIME_HH_DD} from "../../utils/dateFormats"
import {DTSLIDER} from "./constants"
import {Row, Col, Container} from "reactstrap"

import { differenceInCalendarYears, differenceInMonths, differenceInHours, differenceInDays, differenceInMinutes, differenceInSeconds} from "date-fns"

export const DateTimeSlider = (props) => {
    const [selectedTime, setSelected] = useState(props.current);
    const [updatedTime, setUpdated] = useState(props.updated);
    const [min, setMin] = useState(props.start);
    const [max, setMax] = useState(props.end);
    const sliderStyle = {position: "relative",
                         width: "100%"};
    useEffect(() => {
        if(props.current && props.current != selectedTime) setSelected(props.current)
        if(props.updated && props.updated != updatedTime) setUpdated(props.updated)
        if(props.start && props.start != min) setMin(props.start)
        if(props.end && props.end != max) setMax(props.end)
    }, [props])

    function tsToDate(ts){
      if (isNaN(parseFloat(ts))) return "NaN";
      return new Date(parseFloat(ts*1000))
    }

    const onChange = ([ms]) => {
        if (isNaN(parseFloat(ms))) return;
        if(Math.floor(parseFloat(selectedTime)) != Math.floor(ms/1000)){
            props.onChange(Math.floor(ms/1000))
        }
    };

    const dateTicks = scaleTime()
      .domain([tsToDate(min), tsToDate(max)])
      .ticks()
      .map(d => +d);
    
    const tick_format = stepSizeToTickFormat(new Date(dateTicks[1]), new Date(dateTicks[0]))
    
    function formatTick(ms) {
        return printts(ms/1000, tick_format);
    }
    
    function stepSizeToTickFormat(a, b){
        let y = differenceInCalendarYears(a, b)
        let m = differenceInMonths(a, b)
        let d = differenceInDays(a, b)
        let h = differenceInHours(a, b)
        let min = differenceInMinutes(a, b)
        let s = differenceInSeconds(a, b)
        if(y > 5) return DATETIME_YEAR
        if(y >= 1) return DATETIME_YY
        if(m >= 1) return DATETIME_YEAR_MONTH
        if(d >= 1 ) return DATETIME_DD_MM
        if(h >= 3) return DATETIME_HH_DD
        if(h >= 1) return DATETIME_HOUR
        if(min >= 1) return DATETIME_HHMM
        if(s >= 1) return DATETIME_SS
        return DATETIME_SSS
    }
    
    return (
      <div className={DTSLIDER.containerClassName}>
           <div className={DTSLIDER.sliderClassName}>
               <div className={DTSLIDER.viewingClassName}>
                    {printts(selectedTime, DATETIME_COMPLETE)}
                </div>
                    <Slider mode={1}
                        domain={[+tsToDate(min), +tsToDate(max)]}
                        rootStyle={sliderStyle}
                        onChange={onChange}
                        values={[+tsToDate(selectedTime)]}>
                    <Rail>
                    {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                    </Rail>
                    <Handles>
                    {({ handles, getHandleProps }) => (
                        <div>
                        {handles.map(handle => (
                            <Handle key={handle.id}
                                    handle={handle}
                                    domain={[+ tsToDate(min), +tsToDate(max)]}
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
