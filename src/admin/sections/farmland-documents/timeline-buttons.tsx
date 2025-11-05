'use client';

import { Button, Card, Stack, Typography } from '@mui/material';

interface Props {
  handleButtonClick: (button: string) => void;
  setActiveView: (button: string) => void;
  activeView: string
}

function TimelineButtonView({ handleButtonClick, setActiveView, activeView }: Props) {

  const onButtonClick = (button: string) => {
    setActiveView(button);
    handleButtonClick(button);
  }

  return (
    <>
      <Stack direction="row" justifyContent='space-between'>
        <Card sx={{
          p: 1, px: 2, boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: 5,
          width: '40%',
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" spacing={2}>

            <Button
              variant={activeView === 'timeline' ? 'contained' : 'text'}
              onClick={() => onButtonClick('timeline')}
              sx={{
                textTransform: 'none',
                borderRadius: 20,
                bgcolor: activeView === 'timeline' ? 'primary.main' : 'transparent',
                color: activeView === 'timeline' ? 'white' : '#9B9B9B',
                width: '50%',
              }}
            >
              <Typography variant="body2">Timeline</Typography>
            </Button>

            <Button
              variant={activeView === 'file' ? 'contained' : 'text'}
              onClick={() => onButtonClick('file')}
              sx={{
                textTransform: 'none',
                borderRadius: 20,
                bgcolor: activeView === 'file' ? 'primary.main' : 'transparent',
                color: activeView === 'file' ? 'white' : '#9B9B9B',
                width: '50%',
              }}
            >
              <Typography variant="body2">File View</Typography>
            </Button>
          </Stack>
        </Card>

      </Stack>
    </>
  )
}

export default TimelineButtonView;
