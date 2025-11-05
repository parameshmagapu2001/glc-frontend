"use client";

import { useState } from 'react';
import { Modal, Box, Typography, Button, Grid, styled, IconButton } from '@mui/material';

interface TagSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedTags: string[]) => void;
}

interface TagCardProps {
  icon: string;
  title: string;
  selected?: boolean;
  onClick: () => void;
}

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '800px',
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: '16px',
  padding: '32px',
  [theme.breakpoints.down('md')]: {
    padding: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  backgroundColor: '#f3f4ff',
}));

const TagCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  borderRadius: '12px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  backgroundColor: selected ? theme.palette.primary.main : '#fff',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const TagTitle = styled(Typography)<{ selected?: boolean }>(({ selected }) => ({
  fontSize: '14px',
  color: selected ? '#fff' : '#374151',
  textAlign: 'center',
  fontFamily: 'Inter, sans-serif',
}));

const TagCardComponent = ({ icon, title, selected, onClick }: TagCardProps) => (
  <TagCard selected={selected} onClick={onClick} >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "135px",
        height: "135px",
        marginBottom: "10px"
      }}
    >
      {/* Background half-circle */}
      <img
        src={selected ? "/assets/images/halfCircle2.svg" : "/assets/images/halfCircle.svg"}
        alt="circle"
        width= "135px"
        height= "135px"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          opacity: selected ? 1 : 0.6,
        }}
      />

      {/* Icon wrapper */}
      <IconWrapper
        sx={{
          width: 90, 
          height: 90, 
          bgcolor: "#ffffff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          zIndex: 2,
        }}
      >
        <img src={icon} alt={title} style={{ width: 28, height: 28 }} />
      </IconWrapper>
    </Box>

    {/* Title */}
    <TagTitle selected={selected}>{title}</TagTitle>

    {/* Selected check icon */}
    {selected && (
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          color: "#fff",
          p: 0,
        }}
      >
        <img src="/assets/images/rightClick.svg" alt="clicked Icon" />
      </IconButton>
    )}
  </TagCard>
);

const tagOptions = [
  { id: 'trending', icon: '/assets/images/IconChartLine.svg', title: 'Trending Farmland' },
  { id: 'searched', icon: '/assets/images/IconSearch.svg', title: 'Most Searched' },
  { id: 'new', icon: '/assets/images/IconStar.svg', title: 'Newly Listed' },
  { id: 'hot', icon: '/assets/images/IconFlame.svg', title: 'Hot Deals' },
  { id: 'best', icon: '/assets/images/IconAward.svg', title: 'Best Sellers' },
  { id: 'certified', icon: '/assets/images/IconCertificate.svg', title: 'GLC Certified' },
];

export default function TagSelectionModal({ open, onClose, onSubmit }: TagSelectionModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagClick = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedTags);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="tag-selection-modal"
      aria-describedby="select-tags-for-farmlands"
    >
      <ModalContainer>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 600,
              color: '#000',
              mb: 1.5,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Add Tag
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '13px', sm: '14px' },
              color: '#666',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Please select tags below to categorize the farmlands in Website/App.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {tagOptions.map((tag) => (
            <Grid item xs={12} sm={6} md={4} key={tag.id}>
              <TagCardComponent
                icon={tag.icon}
                title={tag.title}
                selected={selectedTags.includes(tag.id)}
                onClick={() => handleTagClick(tag.id)}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={handleSubmit}
            sx={{
              bgcolor: '#6366f1',
              color: '#fff',
              borderRadius: '8px',
              px: 3,
              py: 1.5,
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              '&:hover': {
                bgcolor: '#4f46e5',
              },
            }}
          >
            Add Tag
          </Button>
        </Box>
      </ModalContainer>
    </Modal>
  );
}

