'use client';

import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const X_AXIS_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const StyledRoot = styled('div')(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0px 4px 12.3px 0px rgba(0,0,0,0.07)',
  padding: '24px',
  width: '100%',
  margin: '0 auto',
  height: '400px',
  backgroundColor: '#FFF',
}));

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8%',
  // [theme.breakpoints.down('sm')]: {
  //   flexDirection: 'column',
  //   alignItems: 'flex-start',
  //   gap: '16px',
  // },
}));

const Title = styled('div')({
  fontFamily: "'Nunito Sans', sans-serif",
  fontWeight: 700,
  fontSize: '14px',
  color: '#000',
});

const DateSelectors = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    gap: '8px',
  },
}));

const DateSelector = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: '6px 16px',
  border: '0.954px solid #8280FF',
  borderRadius: '30px',
  cursor: 'pointer',
  backgroundColor: '#FFF',
  height: '27px',
}));

const DateText = styled('div')({
  fontFamily: "'Nunito Sans', sans-serif",
  fontSize: '9px',
  color: '#8280FF',
  marginRight: '8px',
});

const DropdownIcon = styled('svg')({
  width: '10px',
  height: '5px',
});

const DropdownMenu = styled('div')({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: '8px',
  backgroundColor: '#FFF',
  border: '1px solid #8280FF',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  zIndex: 1000,
  maxHeight: '200px',
  overflowY: 'auto',
});

const DropdownItem = styled('div')({
  padding: '8px 16px',
  fontFamily: "'Nunito Sans', sans-serif",
  fontSize: '12px',
  color: '#000',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(130, 128, 255, 0.1)',
  },
});

const ChartContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  flexDirection: 'column',
  height: '246px',
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

const ChartContent = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const YAxis = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px 0',
  textAlign: 'right',
  width: '30px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row',
    width: '100%',
    padding: '0',
    justifyContent: 'space-between',
  },
}));

const AxisLabel = styled('div')({
  fontFamily: "'Inter', sans-serif",
  fontSize: '12px',
  color: 'rgba(0,0,0,0.4)',
});

const Chart = styled('div')({
  flex: 1,
  position: 'relative',
  height: '100%',
  minHeight: '200px',
});

const XAxis = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '8px',
  marginTop: '16px',
  width: '100%',
  paddingLeft: '30px', 
});

const XAxisLabel = styled('div')({
  fontFamily: "'Inter', sans-serif",
  fontSize: '12px',
  color: 'rgba(0,0,0,0.4)',
  textAlign: 'center',
});

export default function WebsiteVisitors():JSX.Element  {
  const [startMonth, setStartMonth] = useState('Start Month');
  const [endMonth, setEndMonth] = useState('End Month');
  const [startDropdownOpen, setStartDropdownOpen] = useState(false);
  const [endDropdownOpen, setEndDropdownOpen] = useState(false);

    const startRef = useRef<HTMLDivElement | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);
  
     useEffect(() => {
       function handleClickOutside(event: MouseEvent) {
         if (startRef.current && !startRef.current.contains(event.target as Node)) {
           setStartDropdownOpen(false);
         }
         if (endRef.current && !endRef.current.contains(event.target as Node)) {
           setEndDropdownOpen(false);
         }
       }
       document.addEventListener('mousedown', handleClickOutside);
       return () => {
         document.removeEventListener('mousedown', handleClickOutside);
       };
     }, []);
 

     const handleStartMonthSelect = (month: string) => {
      setStartMonth(month);
      setStartDropdownOpen(false);
    };
  
    const handleEndMonthSelect = (month: string) => {
      setEndMonth(month);
      setEndDropdownOpen(false);
    };

    
  return (
    <StyledRoot>
      <Header>
        <Title>Website Visitors</Title>
        <DateSelectors sx={{display:'flex', flexDirection:'row'}}>
          <DateSelector ref={startRef} onClick={() => setStartDropdownOpen(!startDropdownOpen)}>
            <DateText>{startMonth}</DateText>
            <DropdownIcon viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.0774 0.6875L5.30532 5.45962L0.533203 0.6875"
                stroke="#8280FF"
                strokeWidth="0.954424"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </DropdownIcon>
            {startDropdownOpen && (
              <DropdownMenu>
                {MONTHS.map((month) => (
                  <DropdownItem key={month} onClick={() => handleStartMonthSelect(month)}>
                    {month}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </DateSelector>
          <DateSelector ref={endRef} onClick={() => setEndDropdownOpen(!endDropdownOpen)}>
            <DateText>{endMonth}</DateText>
            <DropdownIcon viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.1067 0.6875L5.33462 5.45962L0.5625 0.6875"
                stroke="#8280FF"
                strokeWidth="0.954424"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </DropdownIcon>
            {endDropdownOpen && (
              <DropdownMenu>
                {MONTHS.map((month) => (
                  <DropdownItem key={month} onClick={() => handleEndMonthSelect(month)}>
                    {month}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </DateSelector>
        </DateSelectors>
      </Header>
      <ChartContainer>
        <ChartContent>
          <YAxis>
            <AxisLabel>30K</AxisLabel>
            <AxisLabel>20K</AxisLabel>
            <AxisLabel>10K</AxisLabel>
            <AxisLabel>0</AxisLabel>
          </YAxis>
          <Chart>
            <svg
              width="744"
              height="246"
              viewBox="0 0 744 246"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              <mask
                id="mask0_15_571"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="744"
                height="246"
              >
                <rect width="744" height="246" fill="black" />
              </mask>
              <g mask="url(#mask0_15_571)">
                <path
                  d="M0 185.525L49.0895 138.604C52.986 134.879 58.2209 132.885 63.6078 133.074L117.976 134.975L178.365 139.052C182.487 139.331 186.593 138.326 190.12 136.176L268.642 88.3257C273.306 85.4835 279.388 86.9092 282.303 91.5282L327.799 163.622C331.212 169.03 337.004 172.479 343.385 172.904L411.789 177.456C417.971 177.867 423.995 175.39 428.1 170.749L463.568 130.64C468.732 124.8 476.818 122.493 484.286 124.729L532.077 139.035C542.615 142.189 553.722 136.241 556.938 125.722L572.116 76.0746C574.542 68.1403 581.615 62.5275 589.893 61.9675L657.636 57.3844C659.671 57.2468 661.672 56.7988 663.571 56.0561L744 24.6"
                  stroke="#AEC7ED"
                  strokeLinecap="round"
                  strokeDasharray="2 4"
                />
              </g>
            </svg>
            <svg
              width="744"
              height="246"
              viewBox="0 0 744 246"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            >
              <defs>
                <radialGradient
                  id="paint0_radial_15_574"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(371.999 65.2696) rotate(90) scale(151.518 371.999)"
                >
                  <stop stopOpacity="0.1" />
                  <stop offset="1" stopOpacity="0" />
                </radialGradient>
                <linearGradient
                  id="paint1_linear_15_574"
                  x1="3.50707"
                  y1="203.691"
                  x2="744"
                  y2="203.691"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopOpacity="0.4" />
                  <stop offset="1" />
                </linearGradient>
              </defs>
              <mask
                id="mask0_15_574"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="744"
                height="246"
              >
                <rect width="744" height="246" fill="black" />
              </mask>
              <g mask="url(#mask0_15_574)">
                <mask
                  id="mask1_15_574"
                  style={{ maskType: 'alpha' }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="35"
                  width="744"
                  height="211"
                >
                  <path
                    d="M39.9519 130.952L0 144.357V246H744V68.7885L694.554 74.1404C691.173 74.5063 687.941 75.7282 685.164 77.6905L647.397 104.377C640.295 109.396 630.763 109.25 623.818 104.015L590.898 79.2029C582.347 72.7575 571.008 71.359 561.147 75.5332L531.962 87.887C525 90.8339 516.933 88.1394 513.14 81.6001L490.516 42.599C485.379 33.7436 473.077 32.5222 466.299 40.1947L454.732 53.289C446.144 63.0107 433.375 67.9643 420.477 66.5776L382.964 62.544C375.771 61.7706 368.721 64.9418 364.528 70.837L326.748 123.952C322.644 129.722 315.793 132.892 308.738 132.286L249.316 127.179C238.916 126.285 228.58 129.492 220.512 136.115L205.195 148.688C193.33 158.427 178.914 164.547 163.667 166.318L132.209 169.972C128.273 170.429 124.426 171.469 120.796 173.057L107.055 179.066C97.7704 183.127 86.9164 179.602 81.7894 170.861L63.5654 139.793C58.7773 131.631 48.9236 127.941 39.9519 130.952Z"
                    fill="url(#paint0_radial_15_574)"
                  />
                </mask>
                <g mask="url(#mask1_15_574)">
                  <path
                    opacity="0.8"
                    d="M39.9519 130.952L0 144.357V246H744V68.7885L694.554 74.1404C691.173 74.5063 687.942 75.7282 685.164 77.6905L647.397 104.377C640.295 109.396 630.763 109.25 623.818 104.015L590.898 79.2029C582.347 72.7575 571.008 71.359 561.147 75.5332L531.962 87.887C525 90.8339 516.933 88.1394 513.14 81.6001L490.516 42.599C485.379 33.7436 473.077 32.5222 466.299 40.1947L454.732 53.289C446.144 63.0107 433.375 67.9643 420.477 66.5776L382.964 62.544C375.771 61.7706 368.721 64.9418 364.528 70.837L326.748 123.952C322.644 129.722 315.793 132.892 308.738 132.286L249.316 127.179C238.916 126.285 228.58 129.492 220.512 136.115L205.195 148.688C193.33 158.427 178.914 164.547 163.667 166.318L132.209 169.972C128.273 170.429 124.426 171.469 120.796 173.057L107.055 179.066C97.7704 183.127 86.9164 179.602 81.7894 170.861L63.5654 139.793C58.7773 131.631 48.9236 127.941 39.9519 130.952Z"
                    fill="#3558F6"
                  />
                </g>
                <path
                  d="M0 143.868L30.7798 133.582C39.5402 130.655 43.9203 129.191 48.0458 129.546C51.6844 129.859 55.1678 131.162 58.1182 133.314C61.4636 135.754 63.8073 139.734 68.4949 147.692L76.4001 161.114C81.4892 169.754 84.0338 174.075 87.6706 176.583C90.8747 178.792 94.6538 180.019 98.5448 180.112C102.961 180.218 107.558 178.216 116.752 174.212L117.535 173.87C120.804 172.446 122.439 171.735 124.122 171.173C125.618 170.673 127.143 170.263 128.687 169.944C130.425 169.584 132.196 169.38 135.738 168.97L152.084 167.079C163.632 165.743 169.407 165.075 174.931 163.619C182.292 161.679 189.339 158.697 195.858 154.765C200.75 151.815 205.25 148.136 214.251 140.777V140.777C220.435 135.722 223.527 133.194 226.934 131.365C231.474 128.929 236.442 127.392 241.565 126.84C245.409 126.426 249.388 126.766 257.347 127.448L301.954 131.265C308.578 131.832 311.89 132.116 314.943 131.415C317.646 130.796 320.19 129.621 322.414 127.965C324.928 126.095 326.859 123.39 330.723 117.98L360.454 76.3518C364.41 70.814 366.387 68.0451 368.965 66.1518C371.246 64.4767 373.857 63.3048 376.624 62.7135C379.752 62.0451 383.136 62.4074 389.902 63.132L411.869 65.4843C420.326 66.3899 424.554 66.8427 428.575 66.4613C435.914 65.7651 442.917 63.0547 448.812 58.6292C452.042 56.2045 454.864 53.0232 460.507 46.6605V46.6605C465.727 40.7759 468.337 37.8336 471.075 36.5246C476.118 34.1143 482.082 34.7072 486.551 38.0631C488.978 39.8856 490.958 43.2841 494.917 50.0811L509.159 74.5327C512.92 80.9899 514.8 84.2185 517.501 86.109C519.881 87.7747 522.694 88.7136 525.597 88.8116C528.892 88.9228 532.335 87.4714 539.22 84.5685L551.672 79.3195C560.931 75.4163 565.56 73.4647 570.274 73.0578C574.445 72.6978 578.646 73.2148 582.605 74.5756C587.08 76.1135 591.097 79.1296 599.133 85.1616L616.872 98.4767C623.558 103.495 626.9 106.005 630.582 107.011C633.833 107.899 637.256 107.952 640.532 107.163C644.243 106.271 647.662 103.865 654.498 99.0541L682.635 79.2535C685.155 77.4802 686.415 76.5936 687.776 75.9166C688.985 75.3154 690.252 74.8383 691.557 74.4923C693.026 74.1027 694.558 73.9376 697.622 73.6074L744 68.608"
                  stroke="url(#paint1_linear_15_574)"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </Chart>
        </ChartContent>
        <XAxis>
          {X_AXIS_MONTHS.map((month) => (
            <XAxisLabel key={month}>{month.substring(0, 3)}</XAxisLabel>
          ))}
        </XAxis>
      </ChartContainer>
    </StyledRoot>
  );
}