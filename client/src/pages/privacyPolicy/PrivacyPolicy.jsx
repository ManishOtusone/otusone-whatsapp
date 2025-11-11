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

function PrivacyPolicy() {
  return (
    <PolicyPaper>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Privacy Policy
      </Typography>
      <SubText>Last updated: {LAST_UPDATED}</SubText>
      <Divider sx={{ my: 2 }} />

      <SectionTitle>1. Introduction</SectionTitle>
      <Typography>
        Welcome to {ORG.appName} by {ORG.companyName} (“we”, “us”, “our”). This
        Privacy Policy explains how we collect, use, disclose, and safeguard
        personal data when you use our services, including sending WhatsApp
        template messages via Meta’s WhatsApp Cloud API.
      </Typography>

      <SectionTitle>2. Data We Collect</SectionTitle>
      <Typography>We may collect the following categories of data:</Typography>
      <List>
        <ListItem>
          <Typography>
            <strong>Identifiers:</strong> Name, phone number (including WhatsApp
            number), email (if provided), and organization details.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Message Metadata:</strong> Template IDs/names, delivery
            status, timestamps, WhatsApp conversation IDs.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Logs & Diagnostics:</strong> API request/response logs,
            error traces (no message content beyond what’s necessary to
            troubleshoot).
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Billing/Account Data:</strong> Plan, usage, invoices (if
            applicable).
          </Typography>
        </ListItem>
      </List>

      <SectionTitle>3. How We Use Data</SectionTitle>
      <List>
        <ListItem>
          <Typography>
            To send WhatsApp template messages and notifications you authorize.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>To comply with WhatsApp Business/Cloud API policies.</Typography>
        </ListItem>
        <ListItem>
          <Typography>
            To provide support, improve reliability, and enhance the service.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>To detect, prevent, and address abuse or fraud.</Typography>
        </ListItem>
      </List>

      <SectionTitle>4. Legal Bases (if applicable)</SectionTitle>
      <Typography>
        Depending on your jurisdiction, we rely on consent, contract
        performance, and legitimate interests (service operation, security, and
        support). Where required, you must obtain your end users’ consent to
        receive WhatsApp messages.
      </Typography>

      <SectionTitle>5. Sharing of Data</SectionTitle>
      <Typography>
        We share data only as needed to operate the service:
      </Typography>
      <List>
        <ListItem>
          <Typography>
            <strong>Meta/WhatsApp:</strong> For message delivery via WhatsApp
            Cloud API.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Service Providers:</strong> Hosting, analytics, logging, or
            email—under contractual obligations.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            <strong>Legal/Compliance:</strong> When required by law or to defend
            legal claims.
          </Typography>
        </ListItem>
      </List>

      <SectionTitle>6. Data Retention</SectionTitle>
      <Typography>
        We retain data only for as long as necessary for the purposes described
        above or as required by law/regulatory obligations. Message metadata may
        be retained for troubleshooting, audit, and billing records.
      </Typography>

      <SectionTitle>7. Security</SectionTitle>
      <Typography>
        We implement reasonable technical and organizational measures to protect
        data (encryption in transit, access controls, least-privilege
        principles). However, no method is 100% secure.
      </Typography>

      <SectionTitle>8. Your Rights</SectionTitle>
      <Typography>
        You may request access, correction, or deletion of your personal data.
        Contact us at{" "}
        <Link href={`mailto:${ORG.legalEmail}`}>{ORG.legalEmail}</Link>. If you
        are an end user of our customer, please contact the customer (data
        controller) first; we will support their requests.
      </Typography>

      <SectionTitle>9. Children’s Privacy</SectionTitle>
      <Typography>
        Our services are not intended for individuals under 13 (or the age
        required by local law).
      </Typography>

      <SectionTitle>10. International Transfers</SectionTitle>
      <Typography>
        Your data may be processed in locations where our infrastructure or
        providers are based. We take steps to ensure appropriate safeguards.
      </Typography>

      <SectionTitle>11. Changes</SectionTitle>
      <Typography>
        We may update this Privacy Policy. Material changes will be indicated by
        updating the “Last updated” date above.
      </Typography>

      <SectionTitle>12. Contact</SectionTitle>
      <Typography>
        {ORG.companyName}, {ORG.addressLine}
        <br />
        Email: <Link href={`mailto:${ORG.legalEmail}`}>{ORG.legalEmail}</Link>
      </Typography>
    </PolicyPaper>
  );
}

export default PrivacyPolicy;