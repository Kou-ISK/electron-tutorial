import { useState } from "react";
import { TimelineData } from "../types/TimelineData";
import { ulid } from "ulid";

export const useVideoPlayerApp = () => {
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [selectedTimelineIdList, setSelectedTimelineIdList] = useState<string[]>([]);
    const [videoList, setVideoList] = useState<string[]>();
    const [currentTime, setCurrentTime] = useState(0);
    const [timelineFilePath, setTimelineFilePath] = useState<string | undefined>();
    const [metaDataConfigFilePath, setMetaDataConfigFilePath] = useState<string>('');

    const [isFileSelected, setIsFileSelected] = useState(false);

    const [maxSec, setMaxSec] = useState(0);

    const [isVideoPlaying, setisVideoPlaying] = useState<boolean>(false);
    const [playBackRate, setPlayBackRate] = useState(1);

    const handleCurrentTime = (event: Event, newValue: number | number[]) => {
        setCurrentTime(newValue as number);
    };
    const [packagePath, setPackagePath] = useState<string>('');

    const addTimelineData = (actionName: string,
        startTime: number,
        endTime: number,
        qualifier: string) => {
        const newTimelineInstance: TimelineData = { id: ulid(), actionName, startTime, endTime, qualifier };
        setTimeline([...timeline, newTimelineInstance]);
    }

    const deleteTimelineDatas = (idList: string[]) => {
        const newTimeline = timeline.filter(item => !idList.includes(item.id))
        setTimeline(newTimeline)
    }

    const updateQualifier = (id: string, qualifier: string) => {
        const updatedTimeline = timeline.map((item) =>
            item.id === id ? { ...item, qualifier } : item
        )
        setTimeline(updatedTimeline)
    }

    const getSelectedTimelineId = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (event.target.checked) {
            setSelectedTimelineIdList([...selectedTimelineIdList, id])
        } else {
            const newSelectedTimelineIdList = selectedTimelineIdList.filter(item => item !== id)
            setSelectedTimelineIdList(newSelectedTimelineIdList)
        }
    }

    return {
        timeline, setTimeline, selectedTimelineIdList, setSelectedTimelineIdList, videoList, setVideoList,
        currentTime, setCurrentTime, timelineFilePath, setTimelineFilePath,
        metaDataConfigFilePath, setMetaDataConfigFilePath,
        isFileSelected, setIsFileSelected,
        maxSec, setMaxSec, isVideoPlaying, setisVideoPlaying, playBackRate, setPlayBackRate, handleCurrentTime,
        packagePath, setPackagePath, addTimelineData, deleteTimelineDatas, updateQualifier, getSelectedTimelineId
    }
}