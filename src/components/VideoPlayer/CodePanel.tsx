import { Box } from '@mui/material';
import { CodeButton } from './CodeButton';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import React from 'react';

interface CodePanelProps {
  metaDataConfigFilePath: string;
  addTimelineData: (
    actionName: string,
    startTime: number,
    endTime: number,
    qualifier: string,
  ) => void;
  teamNames: string[];
  setTeamNames: Dispatch<SetStateAction<string[]>>;
}

export const CodePanel = ({
  metaDataConfigFilePath,
  addTimelineData,
  teamNames,
  setTeamNames,
}: CodePanelProps) => {
  // .metadata/config.jsonの内容を読み込み、チーム名をボタンにつける
  const [actionList, setActionList] = useState([]);

  useEffect(() => {
    if (metaDataConfigFilePath !== undefined && metaDataConfigFilePath !== '') {
      console.log(`metadata config: ${metaDataConfigFilePath}`);
      fetch(metaDataConfigFilePath)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setTeamNames([data.team1Name, data.team2Name]);
            setActionList(data.actionList);
          }
        })
        .catch((error) => console.error('Error loading JSON:', error));
    }
  }, [metaDataConfigFilePath]);

  return (
    <Box
      sx={{
        border: '2px primary.main',
        padding: '2px',
        overflowY: 'scroll',
        width: '25vw',
      }}
    >
      {actionList &&
        actionList.map((value) => (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {teamNames.map((teamName, index) => (
                <CodeButton
                  key={index}
                  actionName={teamName + ' ' + value}
                  addTimelineData={addTimelineData}
                  color={index === 0 ? 'error' : 'primary'}
                />
              ))}
            </Box>
          </>
        ))}
    </Box>
  );
};
