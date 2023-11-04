import { Box, Button, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import { PackageDatas } from '../../renderer';
import { MetaData } from '../../types/MetaData';
import React from 'react';

interface VideoPathSelectorProps {
  setVideoList: any;
  setIsFileSelected: any;
  isFileSelected: boolean;
  setTimelineFilePath: any;
  setPackagePath: any;
  setMetaDataConfigFilePath: any;
  metaDataConfigFilePath: string;
}

export const VideoPathSelector = ({
  setVideoList,
  setIsFileSelected,
  isFileSelected,
  setTimelineFilePath,
  setPackagePath,
  setMetaDataConfigFilePath,
  metaDataConfigFilePath,
}: VideoPathSelectorProps) => {
  useEffect(() => {
    console.log(metaDataConfigFilePath);
    if (metaDataConfigFilePath !== '') {
      console.log(metaDataConfigFilePath);
      fetch(metaDataConfigFilePath)
        .then((response) => response.json())
        .then((data) => setMetaData(data))
        .catch((error) => console.error('Error loading JSON:', error));
      if (metaData) {
        if (metaData.wideViewPath) {
          setVideoList([metaData.tightViewPath, metaData.wideViewPath]);
        } else {
          setVideoList([metaData.tightViewPath]);
        }
      }
    }
  }, [metaDataConfigFilePath]);

  const [hasOpenModal, setHasOpenModal] = useState<boolean>(false);
  const [packageName, setPackageName] = useState<string>('');
  const [team1Name, setTeam1Name] = useState<string>('');
  const [team2Name, setTeam2Name] = useState<string>('');
  const [metaData, setMetaData] = useState<MetaData>();

  const handleHasOpenModal = () => {
    setHasOpenModal(true);
  };

  // パッケージを選択した場合
  // TODO パッケージ読み込み時にmetaDataを読み込み、記載されているパスのビデオを読み込む。
  // TODO setMetaDataがうまくいかない問題に対応する
  const setVideoPathByPackagePath = async () => {
    const packagePath = await window.electronAPI.openDirectory();
    if (packagePath) {
      console.log(packagePath + '/.metadata/config.json');
      setMetaDataConfigFilePath(packagePath + '/.metadata/config.json');
      setTimelineFilePath(packagePath + '/timeline.json');
      setPackagePath(packagePath);
      setIsFileSelected(!isFileSelected);
      console.log('Selected file:', packagePath);
    } else {
      console.log('No file selected.');
    }
  };

  // ファイル選択後にチーム名を選択し、.metadata/config.jsonに書き込む
  const createPackage = async (packageName: string) => {
    const directoryName = await window.electronAPI.openDirectory();
    const tightViewPath: string = await window.electronAPI.openFile();
    // TODO wideViewPath選択を任意にする
    const wideViewPath: string = await window.electronAPI.openFile();
    const metaDataConfig: MetaData = {
      tightViewPath: tightViewPath,
      wideViewPath: wideViewPath,
      team1Name: team1Name,
      team2Name: team2Name,
      actionList: [
        'ポゼッション',
        'スクラム',
        'ラインアウト',
        'キック',
        'タックル',
        'PK',
        'FK',
        'Check',
        'キックオフ',
        'トライ',
        'ショット',
      ],
    };
    const packageDatas: PackageDatas = await window.electronAPI.createPackage(
      directoryName,
      packageName,
      tightViewPath,
      wideViewPath,
      metaDataConfig,
    );
    setVideoList([packageDatas.tightViewPath, packageDatas.wideViewPath]);
    setTimelineFilePath(packageDatas.timelinePath);
    setHasOpenModal(!hasOpenModal);
    setIsFileSelected(!isFileSelected);
    setMetaDataConfigFilePath(packageDatas.metaDataConfigFilePath);
  };

  return (
    <div style={{ marginLeft: '20vw', marginRight: '20vw' }}>
      <Box display={'flex'} flexDirection={'column'}>
        <Button
          sx={{ height: '200px', fontsize: '200px', margin: '20px' }}
          onClick={setVideoPathByPackagePath}
          variant="contained"
        >
          ビデオパッケージを選択
        </Button>
        <Button
          sx={{ height: '200px', fontsize: '200px', margin: '20px' }}
          onClick={handleHasOpenModal}
          variant="outlined"
        >
          新規パッケージ
        </Button>
      </Box>
      {hasOpenModal && (
        <Box>
          <div>
            <label htmlFor="packageName">パッケージ名</label>
            <Input
              id="packageName"
              value={packageName}
              onChange={(e) => setPackageName(e.currentTarget.value)}
            />
          </div>
          <div>
            <label htmlFor="team1Name">チーム名(1)</label>
            <Input
              id="team1Name"
              value={team1Name}
              onChange={(e) => setTeam1Name(e.currentTarget.value)}
            ></Input>
          </div>
          <div>
            <label htmlFor="team2Name">チーム名(2)</label>
            <Input
              id="team2Name"
              value={team2Name}
              onChange={(e) => setTeam2Name(e.currentTarget.value)}
            ></Input>
          </div>
          <Button
            variant="contained"
            onClick={() => createPackage(packageName)}
          >
            作成
          </Button>
        </Box>
      )}
    </div>
  );
};
