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

function TermsOfService() {
  return (
    <PolicyPaper>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Terms of Service
      </Typography>
      <SubText>Last updated: {LAST_UPDATED}</SubText>
      <Divider sx={{ my: 2 }} />

      <SectionTitle>1. Acceptance of Terms</SectionTitle>
      <Typography>
        By accessing or using {ORG.appName} (the “Service”), you agree to these
        Terms. If you use the Service on behalf of an organization, you represent
        that you have authority to bind that organization.
      </Typography>

      <SectionTitle>2. Service Description</SectionTitle>
      <Typography>
        {ORG.appName} enables sending WhatsApp template messages via WhatsApp
        Cloud API. You are responsible for the content of messages and obtaining
        necessary end-user consents.
      </Typography>

      <SectionTitle>3. User Responsibilities</SectionTitle>
      <List>
        <ListItem>
          <Typography>
            Comply with WhatsApp Business/Cloud API policies and applicable laws.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            Do not send spam, illegal, harmful, or misleading content.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography>
            Maintain the confidentiality of your API credentials and accounts.
          </Typography>
        </ListItem>
      </List>

      <SectionTitle>4. Availability & Changes</SectionTitle>
      <Typography>
        We strive for high availability but do not guarantee uninterrupted
        service. We may modify, suspend, or discontinue features at any time.
      </Typography>

      <SectionTitle>5. Fees & Billing</SectionTitle>
      <Typography>
        If applicable, you agree to pay usage-based or subscription fees per the
        pricing on {ORG.website}. Taxes and carrier or WhatsApp fees may apply.
      </Typography>

      <SectionTitle>6. Intellectual Property</SectionTitle>
      <Typography>
        We retain all rights in the Service. You retain rights to your content.
        You grant us a license to process your content solely to operate the
        Service.
      </Typography>

      <SectionTitle>7. Prohibited Conduct</SectionTitle>
      <Typography>
        You may not reverse engineer, interfere with security, or misuse the
        Service. Automated scraping of non-public endpoints is prohibited.
      </Typography>

      <SectionTitle>8. Disclaimers</SectionTitle>
      <Typography>
        The Service is provided “as is” without warranties. We do not control or
        guarantee third-party platforms (e.g., WhatsApp) or networks.
      </Typography>

      <SectionTitle>9. Limitation of Liability</SectionTitle>
      <Typography>
        To the maximum extent permitted by law, {ORG.companyName} will not be
        liable for indirect, incidental, special, consequential, or punitive
        damages, or for lost profits, revenues, data, or goodwill.
      </Typography>

      <SectionTitle>10. Indemnification</SectionTitle>
      <Typography>
        You will indemnify and hold {ORG.companyName} harmless from claims
        arising out of your use of the Service, your content, or your breach of
        these Terms or applicable law.
      </Typography>

      <SectionTitle>11. Termination</SectionTitle>
      <Typography>
        We may suspend or terminate your access if you violate these Terms. Upon
        termination, your right to use the Service will cease.
      </Typography>

      <SectionTitle>12. Governing Law</SectionTitle>
      <Typography>
        These Terms are governed by the laws of {ORG.governingLaw}, without
        regard to conflict-of-law principles. Courts located in {ORG.governingLaw} shall
        have exclusive jurisdiction.
      </Typography>

      <SectionTitle>13. Changes</SectionTitle>
      <Typography>
        We may update these Terms from time to time. Continued use indicates
        acceptance of the updated Terms.
      </Typography>

      <SectionTitle>14. Contact</SectionTitle>
      <Typography>
        Questions? Contact{" "}
        <Link href={`mailto:${ORG.supportEmail}`}>{ORG.supportEmail}</Link>.
      </Typography>
    </PolicyPaper>
  );
}

export default TermsOfService;