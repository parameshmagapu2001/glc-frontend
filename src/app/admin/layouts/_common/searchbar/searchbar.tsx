// 'use client';

// import { useState, memo, useCallback, useContext, useEffect } from 'react';
// import parse from 'autosuggest-highlight/parse';
// import match from 'autosuggest-highlight/match';
// import Stack from '@mui/material/Stack';
// import { Autocomplete, InputAdornment, autocompleteClasses, debounce, Avatar, Link, Typography } from '@mui/material';
// import TextField from '@mui/material/TextField';
// import Iconify from 'src/components/iconify';
// import SearchNotFound from 'src/components/search-not-found/search-not-found';
// import { paths } from 'src/routes/paths';
// import { IConsumerSearchItem } from 'src/types/consumers';
// import { getConsumerSearch } from 'src/api/consumer';
// import { AuthContext } from 'src/auth/context';

// // ----------------------------------------------------------------------

// function Searchbar() {

//   const [searchLoading, setSearchLoading] = useState(false);
//   const [searchResults, setSearchResults] = useState<IConsumerSearchItem[]>([]);
//   const [query, setQuery] = useState("");
//   const [inputValues, setInputValues] = useState<string>('');
//   const [selectedValue, setSelectedValue] = useState<IConsumerSearchItem | null>(null);

//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     if (selectedValue) {
//       setInputValues('');
//       setSelectedValue(null);
//     }
//   }, [selectedValue]);

//   const handleClick = (id: string) => {
//     const newTab = window.open(
//       paths.rm.consumer.details(parseInt(id, 10)),
//       '_blank'
//     );

//     if (newTab) {
//       newTab.focus();
//     } else {
//       console.error('Failed to open a new tab.');
//     }
//   };

//   const debouncedApiCall = debounce((searchKey: string) => {
//     fetchSearch(searchKey);
//   }, 1000);

//   const handleSearch = useCallback((value: string) => {
//     if (value !== null && value !== undefined && value !== '') {
//       debouncedApiCall(value);
//     }
//   }, [debouncedApiCall]);

//   const fetchSearch = async (searchKey: string) => {
//     setSearchLoading(true);
//     setQuery(searchKey);
//     try {
//       const response = await getConsumerSearch(searchKey);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const renderButton = (
//       <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
//         <Autocomplete
//           sx={{ width: { xs: 1, sm: 260, md: 500 } }}
//           loading={searchLoading}
//           autoHighlight
//           popupIcon={null}
//           options={searchResults}
//           value={selectedValue}
//           inputValue={inputValues}
//           onInputChange={(event, newValue) => {
//             setInputValues(newValue);
//             handleSearch(newValue);
//           }}
//           onChange={(event, newValue) => {
//             if (newValue) {
//               setSelectedValue(newValue);
//               handleClick(newValue.id);
//             }
//           }}
//           getOptionLabel={(option) => option.label}
//           noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
//           isOptionEqualToValue={(option, value) => option.id === value.id}
//           slotProps={{
//             popper: {
//               placement: 'bottom-start',
//               sx: { minWidth: 320 },
//             },
//             paper: {
//               sx: { [` .${autocompleteClasses.option}`]: { pl: 0.75 } },
//             },
//           }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Search..."
//               InputProps={{
//                 ...params.InputProps,
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <>
//                     {searchLoading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
//                     {params.InputProps.endAdornment}
//                   </>
//                 ),
//               }}
//             />
//           )}
//           renderOption={(props, post, { inputValue }) => {
//             const matches = match(post.label, inputValue);
//             const parts = parse(post.label, matches);

//             return (
//               <li {...props} key={post.id}>
//                 <Avatar
//                   key={post.id}
//                   alt={post.label}
//                   variant="rounded"
//                   sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
//                 />
//                 <Link
//                   key={inputValue}
//                   underline="none"
//                   onClick={(event) => {
//                     event.stopPropagation();
//                     handleClick(post.id);
//                   }}
//                 >
//                   {parts.map((part, index) => (
//                     <Typography
//                       key={index}
//                       component="span"
//                       color={part.highlight ? 'primary' : 'textPrimary'}
//                       sx={{
//                         typography: 'body2',
//                         fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
//                       }}
//                     >
//                       {part.text}
//                     </Typography>
//                   ))}
//                 </Link>
//               </li>
//             );
//           }}
//         />
//       </Stack>
//   );

//   return (
//     <>
//       {(user?.role_id === 1 || user?.consumers?.indexOf('CMSVP') !== -1) &&
//         <Stack sx={{ mt: 4 }}>
//           {renderButton}
//         </Stack>}
//     </>
//   );
// }

// export default memo(Searchbar);
