import { Paper, TextField } from '@material-ui/core';
import { Search } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import React, { useEffect, useState } from 'react';
import logoMain from '../assets/Logogab.png';
import { AnalysisResult, CanonizedUrl, ScanSectionProps } from '../interfaces';
import { rgbToHex } from '../utils/utils';
import { getCanonizedUrl, getResults } from '../utils/virustotal';

function ScanSection({ result }: any): JSX.Element {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>();
  const [inputURL, setInputUrl] = useState<string>('');
  const [canonizedUrl, setCanonizedUrl] = useState<CanonizedUrl>();
  const [firstColor, setFirstColor] = useState('');
  const [secondColor, setSecondColor] = useState('');
  const [thirdColor, setThirdColor] = useState('');
  const analysisData: string = canonizedUrl?.data?.id!;
  const callStatus: string = analysisResult?.data?.attributes?.status!;

  const submitData = (e: any) => {
    // todo: make it obvious for the user that the button is not clickable
    e.preventDefault(); // prevents user from clicking the search button when already searching
    getResults(analysisData).then((res) => setAnalysisResult(res));
  };

  useEffect(() => {
    getCanonizedUrl(inputURL).then((res) => setCanonizedUrl(res));
  }, [inputURL]);

  useEffect(() => {
    setFirstColor(rgbToHex(result?.result[1]));
    setSecondColor(rgbToHex(result?.result[3]));
    setThirdColor(rgbToHex(result?.result[4]));
  }, [result]);

  // If the result is "queued", it will redo the api call to get the actual result. Enter key listener
  useEffect(() => {
    let intervalID: NodeJS.Timer;
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        getResults(analysisData).then((res) => setAnalysisResult(res));
      }
    };
    document.addEventListener('keydown', listener);
    if (callStatus === 'queued') {
      intervalID = setInterval(() => {
        getResults(analysisData).then((res) => setAnalysisResult(res));
      }, 4000);
    }
    return () => {
      document.removeEventListener('keydown', listener);
      if (intervalID) {
        clearInterval(intervalID);
      }
    };
  }, [analysisData, callStatus]);

  //bg gradient can be made dynamic through the color-mind api or the colors of the logo
  return (
    <>
      {analysisResult?.data?.attributes?.status === 'queued' ? (
        <LinearProgress />
      ) : null}

      <Paper variant='elevation' className='mb-5'>
        <div className='flex mt-10 justify-center  bg-gray-50'>
          <img
            src={logoMain}
            alt='main logo'
            className='w-28 md:w-40 mb-1 mt-5'
          />
        </div>
      </Paper>

      <div className=' mb-2 ml-4 mr-4'>
        <div className='flex justify-center antialiased font-normal text-center prose-xl md:prose-2xl'>
          <p
            style={{
              color: `${firstColor}`,
              marginTop: 0,
            }}
          >
            Analyze suspicious
          </p>
          &nbsp;
          <p
            style={{
              color: `${secondColor}`,
              marginTop: 0,
            }}
          >
            URLs to
          </p>
          &nbsp;
          <p
            style={{
              color: `${thirdColor}`,
              marginTop: 0,
            }}
          >
            detect malware
          </p>
        </div>
      </div>
      <div className='flex justify-center ml-4 mr-4'>
        <form className='mt-20 w-screen md:w-1/2 p-1 ml-2 border-none outline-none flex justify-center'>
          <TextField
            autoComplete='off'
            type='text'
            name='value'
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder='Scan an URL'
            className='w-full'
          />
          <Search
            type='submit'
            onClick={submitData}
            className=' ml-2 mt-2 active:border-indigo-300 cursor-pointer'
          />
        </form>
      </div>

      <div className='flex justify-center'>
        <div>
          {analysisResult
            ? 'Harmless: ' + analysisResult.data?.attributes?.stats?.harmless
            : null}
        </div>
        <div>
          {analysisResult
            ? '  Malicious: ' +
              analysisResult.data?.attributes?.stats?.malicious
            : null}
        </div>
      </div>
    </>
  );
}

export default ScanSection;
