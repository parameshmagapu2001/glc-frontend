'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { listRegionAreas, listStateRegions, listStates } from 'src/api/states';
import { State } from 'src/components/common/states';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { enqueueSnackbar } from 'src/components/snackbar';
import { FarmlandDocumentBody, FarmlandDocuments } from 'src/types/farmlands';
import { fetchDocumentDetails, saveFarmlandDocument } from 'src/api/farmlands';
import { filterAreaAgents } from 'src/api/filters';
import { useBoolean } from 'src/hooks/use-boolean';
import TimelineButtonView from '../timeline-buttons';
// ---------------------------------------------------------------------

const LAND_CONVERSION_OPTIONS = [
  { id: "acres", label: "Acres" },
];
interface Props {
  documentIndex: number;
  document: FarmlandDocuments;
  farmlandId: number;
  areaId: number;
  onNext: (index: number) => void;
}

function LandDetailsForm({ document, farmlandId, documentIndex, onNext, areaId }: Props) {

  const [editable, setEditable] = useState<boolean>(document?.documentStatus === 'Pending');

  const [loading, setLoading] = useState<boolean>(false);

  const [acquisitionCategory, setAcquisitionCategory] = useState('ancestral');

  const [agentLocation, setAgentLocation] = useState('Default');

  const [selectedState, setSelectedState] = useState('0');

  const [selectedDistrict, setSelectedDistrict] = useState('0');

  const [states, setStates] = useState<State[]>([]);

  const [districts, setDistricts] = useState<State[]>([]);

  const [areas, setAreas] = useState<State[]>([]);

  const [agents, setAgents] = useState<State[]>([]);

  const [selectedArea, setSelectedArea] = useState('0');

  const [valuePerArea, setValuePerArea] = useState(0);

  const [landCost, setLandCost] = useState(0);

  const [landArea, setLandArea] = useState('');

  const [landConversion, setLandConversion] = useState('0');

  const [selectedAgent, setSelectedAgent] = useState("0");

  const [cancelButton, setCancelButton] = useState(false);

  const [timelineViewStatus, setTimelineViewStatus] = useState(false);

  const [activeView, setActiveView] = useState(timelineViewStatus ? 'timeline' : 'file');

  const methods = useForm({});

  const confirm = useBoolean();

  const {
    setValue,
  } = methods;

  const documentRef = useRef(document);

  useEffect(() => {
    if (documentRef.current?.documentDetails) {
      setAcquisitionCategory(documentRef.current?.documentDetails?.acquisitionCategory);
      setAgentLocation(documentRef.current?.documentDetails?.agentLocation);
      setSelectedAgent(documentRef.current?.documentDetails?.agentId || "0");
      setSelectedState(documentRef.current?.documentDetails?.stateId || "0");
      setSelectedDistrict(documentRef.current?.documentDetails?.districtId || "0");
      setSelectedArea(documentRef.current?.documentDetails?.cityId || "0");
      setLandConversion(documentRef.current?.documentDetails?.landConversion || "0");
      setValuePerArea(Number(documentRef.current?.documentDetails?.valuePerArea) || 0);
      setLandCost(Number(documentRef.current?.documentDetails?.landCost) || 0);
      setLandArea(documentRef.current?.documentDetails?.landArea);
      getDistricts(documentRef.current?.documentDetails?.stateId?.toString());
      getAreas(documentRef.current?.documentDetails?.districtId?.toString());
    }
    getAreaAgents(areaId.toString());
    getStates();
  }, [areaId, documentRef.current?.documentDetails, document?.timeLineView, farmlandId, document.documentId]);

  const getStates = async () => {
    const res = await listStates();

    if (res?.data?.length > 0) {
      setStates(res.data);
    }
  };

  const getDistricts = async (id: string) => {
    const res = await listStateRegions(id);
    if (res?.data?.length > 0) {
      setDistricts(res.data);
    }
  };

  const getAreas = async (id: string) => {
    const res = await listRegionAreas(id);
    if (res?.data?.length > 0) {
      setAreas(res.data);
    }
  };

  const getAreaAgents = async (id: string) => {
    const res = await filterAreaAgents(id);
    if (res?.data?.length > 0) {
      setAgents(res.data);
    }
  };

  const handleOnStateChange = (id: string) => {
    setSelectedState(id);
    getDistricts(id);
  };

  const handleOnDistrictChange = (id: string) => {
    setSelectedDistrict(id);
    getAreas(id);
  };

  const handleOnAreaChange = (id: string) => {
    setSelectedArea(id);
    getAreaAgents(id);
  };

  const setEditMode = async () => {
    setEditable(true);
    setCancelButton(true);
  };

  const onCancelEdit = async () => {
    setEditable(false);
    setCancelButton(false);
  };

  const onSave = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();

      if (acquisitionCategory === '' || acquisitionCategory === null) {
        enqueueSnackbar('Please select acquisition category', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (agentLocation === '' || agentLocation === null) {
        enqueueSnackbar('Please select agent location', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (selectedAgent === '0') {
        enqueueSnackbar('Please select an agent', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }
      if (landConversion === '0') {
        enqueueSnackbar('Please select land conversion', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }
      if (valuePerArea === 0 || valuePerArea === null) {
        enqueueSnackbar('Please enter value per area', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (landCost === 0 || landCost === null) {
        enqueueSnackbar('Please enter Total land cost', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (landArea === '' || landArea === null) {
        enqueueSnackbar('Please enter land area', {
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
        });
        return;
      }

      if (agentLocation === 'Other') {
        if (selectedState === '0') {
          enqueueSnackbar('Please select state', {
            variant: 'error',
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
          });
          return;
        }
        if (selectedDistrict === '0') {
          enqueueSnackbar('Please select district', {
            variant: 'error',
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
          });
          return;
        }
        if (selectedArea === '0') {
          enqueueSnackbar('Please select area', {
            variant: 'error',
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
          });
          return;
        }
      }

      const body: FarmlandDocumentBody = {
        documentId: documentRef.current.documentId,
        documentName: documentRef.current.documentName,
        documentStatus: documentRef.current.documentStatus,
        documentDetails: {
          acquisitionCategory,
          agentLocation,
          agentId: selectedAgent,
          agentName: agents.find((agent) => agent.id === selectedAgent)?.label,
          cityId: selectedArea,
          districtId: selectedDistrict,
          stateId: selectedState,
          cityName: areas.find((area) => area.id === selectedArea)?.label,
          districtName: districts.find((district) => district.id === selectedDistrict)?.label,
          stateName: states.find((state) => state.id === selectedState)?.label,
          landConversion,
          valuePerArea,
          landCost,
          landArea,
        }
      };

      const res = await saveFarmlandDocument(farmlandId, documentRef.current.documentId, body);
      enqueueSnackbar('Land details have been saved to drafts', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      });
      refreshDocumentData();
      setEditable(false);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  const refreshDocumentData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDocumentDetails(farmlandId, documentRef.current.documentId);
      documentRef.current = res.data;
      setTimelineViewStatus(res.data.documentDetails?.timelineViewStatus || false);
    } catch (err) {
      console.log('ERROR:', err);
    } finally {
      setLoading(false);
    }
  }, [farmlandId]);

  const renderButtons = () => {
    const { reviewStatus, approveAccess, editAccess } = document;
    if (reviewStatus === 'Approved' || reviewStatus === 'Rejected') {
      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="inherit" size="medium" sx={{ mr: 2, borderRadius: 10 }} disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}> Back </Button>
          <Button variant="contained" size="medium" color="primary" sx={{ borderRadius: 10 }} onClick={() => onNext(documentIndex + 1)}>
            Next
          </Button>
        </Grid>
      );
    }

    if (reviewStatus === 'Pending') {
      if (!approveAccess) {
        return (
          <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {!editable ? (
              <>
                {editAccess ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    sx={{ mr: 2, borderRadius: 10 }}
                    onClick={setEditMode}
                  >
                    Edit
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="medium"
                    sx={{ mr: 2, borderRadius: 10 }}
                    disabled={documentIndex === 0}
                    onClick={() => onNext(documentIndex - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ borderRadius: 10 }}
                  onClick={() => onNext(documentIndex + 1)}
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                {cancelButton && (
                  <Button
                    variant="outlined"
                    size="medium"
                    color="error"
                    sx={{ mr: 2, borderRadius: 10 }}
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="contained"
                  size="medium"
                  color="primary"
                  sx={{ borderRadius: 10 }}
                  onClick={onSave}
                >
                  Save
                </Button>
              </>
            )}
          </Grid>
        );
      }

      return (
        <Grid xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            sx={{ mr: 2, borderRadius: 10 }}
            disabled={documentIndex === 0}
            onClick={() => onNext(documentIndex - 1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            sx={{ borderRadius: 10 }}
            onClick={() => onNext(documentIndex + 1)}
          >
            Next
          </Button>
        </Grid>
      );
    }

    return null;
  }

  const handleButtonClick = (view: string) => {
    setActiveView(view);
  };

  const onHandleEdit = () => {
    setTimelineViewStatus(true)
    setActiveView('file')
    handleButtonClick('file')
  }

  return (
    <>
      {timelineViewStatus && (
        <TimelineButtonView
          handleButtonClick={handleButtonClick}
          setActiveView={setActiveView}
          activeView={activeView} />
      )}

      {activeView === 'file' &&
        <FormProvider methods={methods} onSubmit={() => onSave}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 1,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              px: 2
            }}
          >
            <Stack spacing={2} sx={{ pt: 4, px: 2 }}>
              <Stack spacing={2}>
                {/* Acquisition Category */}
                <FormControl>
                  <FormLabel sx={{ color: "#000000" }}>Please indicate the acquisition category for the land.</FormLabel>
                  <RadioGroup
                    value={acquisitionCategory}
                    onChange={(e) => editable && setAcquisitionCategory(e.target.value)}
                    name="acquisitionCategory"
                  >
                    <FormControlLabel value="self" control={<Radio />} label="Self Purchase" />
                    <FormControlLabel
                      value="ancestral"
                      control={<Radio />}
                      label="Ancestral Property"
                    />
                  </RadioGroup>
                </FormControl>

                {/* Agent Selection */}
                <FormControl>
                  <FormLabel sx={{ color: "#000000" }}>Please select the agent who referred the customer?</FormLabel>
                  <RadioGroup value={agentLocation}
                    onChange={(e) => editable && setAgentLocation(e.target.value)}>
                    <FormControlLabel value="Default" control={<Radio />} label="Default Location" />
                    <FormControlLabel
                      value="Other"
                      control={<Radio />}
                      label="Agent from other Location"
                    />
                  </RadioGroup>
                </FormControl>

              </Stack>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                {agentLocation === 'Other' &&
                  <RHFSelect
                    name="stateId"
                    label="State*"
                    placeholder="Select State"
                    InputLabelProps={{ shrink: true }}
                    value={selectedState}
                    InputProps={{
                      readOnly: !editable,
                    }}
                    onChange={(e) => handleOnStateChange((e.target.value))}
                  >
                    <MenuItem value="0">Select State</MenuItem>
                    {states.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>}

                {agentLocation === 'Other' &&
                  <RHFSelect
                    name="district"
                    label="District*"
                    placeholder="Select District"
                    InputLabelProps={{ shrink: true }}
                    value={selectedDistrict}
                    InputProps={{
                      readOnly: !editable,
                    }}
                    onChange={(e) => handleOnDistrictChange(e.target.value)}
                  >
                    <MenuItem value="0">Select District</MenuItem>
                    {districts.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </RHFSelect >}

                {agentLocation === 'Other' &&
                  <RHFSelect
                    name="cityId"
                    label="Area/City/Town*"
                    placeholder="Select Area"
                    value={selectedArea}
                    InputProps={{
                      readOnly: !editable,
                    }}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => handleOnAreaChange(e.target.value)}
                  >
                    <MenuItem value="0">Select Area</MenuItem>
                    {areas.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>}

                <RHFSelect
                  name="agent"
                  label="Agent*"
                  placeholder="Select Agent"
                  value={selectedAgent}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="0">Select Agent</MenuItem>
                  {agents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      {agent.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFSelect
                  name="landConversion"
                  label="Land Conversion*"
                  value={landConversion}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setLandConversion(e.target.value)}
                  placeholder="Select Land Conversion"
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="0">Select Land Conversion</MenuItem>
                  {LAND_CONVERSION_OPTIONS.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFTextField
                  name="valuePerArea"
                  label=" Value Per Area*"
                  value={valuePerArea}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setValuePerArea(Number(e.target.value))}
                  placeholder="Enter Value Per Area"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name="landArea"
                  label="Total Land Area*"
                  value={landArea}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="Ex : 1 Acre"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  name="landCost"
                  label="Land Cost*"
                  value={landCost}
                  InputProps={{
                    readOnly: !editable,
                  }}
                  onChange={(e) => setLandCost(Number(e.target.value))}
                  placeholder="Enter Land Cost"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                {renderButtons()}
              </Box>
            </Stack>
          </Card>
        </FormProvider>}
    </>
  );
}

export default LandDetailsForm;
