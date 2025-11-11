import React from "react";
import {Typography,Link,List,ListItem,Divider,Paper,} from "@mui/material";

const ORG = {
  companyName: "OTUSONE LLP",
  appName: "OTUSONE",
  website: "https://www.otusone.com/",
  supportEmail: "otusonellp@gmail.com",
  legalEmail: "otusonellp@gmail.com",
  addressLine: "H-112 Noida Sector 63, Uttar Pradesh, 201301, India",
  governingLaw: "India",
  dataDeletionWindowDays: 30,
  companyRegNo: "",
};

const LAST_UPDATED = new Date().toLocaleDateString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function SectionTitle({ children }) {
  return (
    <Typography variant="h6" sx={{ mt: 3, mb: 1.5, fontWeight: 700 }}>
      {children}
    </Typography>
  );
}

function SubText({ children }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
      {children}
    </Typography>
  );
}

function PolicyPaper({ children }) {
  return (
    <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
      {children}
    </Paper>
  );
}

function DataDeletion() {
  return (
    <PolicyPaper>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Data Deletion Instructions
      </Typography>
      <SubText>Last updated: {LAST_UPDATED}</SubText>
      <Divider sx={{ my: 2 }} />

      <SectionTitle>1. Overview</SectionTitle>
      <Typography>
        You can request deletion of your personal data held by {ORG.companyName} in
        relation to {ORG.appName}. This typically includes identifiers (e.g., phone
        numbers), related message metadata, and account information.
      </Typography>

      <SectionTitle>2. How to Request Deletion</SectionTitle>
      <Typography>
        Send an email to{" "}
        <Link href={`mailto:${ORG.legalEmail}`}>{ORG.legalEmail}</Link> with the
        subject line <em>“Data Deletion Request”</em> and include:
      </Typography>
      <List>
        <ListItem>
          <Typography>Your full name and contact number(s)</Typography>
        </ListItem>
        <ListItem>
          <Typography>Any associated account or organization name</Typography>
        </ListItem>
        <ListItem>
          <Typography>
            Details to help us locate your records (e.g., message IDs, dates)
          </Typography>
        </ListItem>
      </List>

      <SectionTitle>3. What We Delete</SectionTitle>
      <Typography>
        After verifying your identity, we will delete personal identifiers and
        associated metadata we store, unless retention is legally required (e.g.,
        fraud prevention, billing, tax, or dispute resolution).
      </Typography>

      <SectionTitle>4. Timeline</SectionTitle>
      <Typography>
        We aim to complete deletion within {ORG.dataDeletionWindowDays} days of
        receiving a valid request and verification. We will confirm via email once
        completed.
      </Typography>

      <SectionTitle>5. Third Parties</SectionTitle>
      <Typography>
        Some processing occurs via third parties (e.g., WhatsApp/Meta, hosting,
        logging). We will pass your deletion request to relevant processors where
        appropriate or provide instructions to contact them if required by their
        policy.
      </Typography>

      <SectionTitle>6. Contact</SectionTitle>
      <Typography>
        {ORG.companyName}, {ORG.addressLine}
        <br />
        Email: <Link href={`mailto:${ORG.legalEmail}`}>{ORG.legalEmail}</Link>
      </Typography>
    </PolicyPaper>
  );
}


export default DataDeletion;
