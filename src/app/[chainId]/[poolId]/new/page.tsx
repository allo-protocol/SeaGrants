import ApplicationForm from "@/components/application/ApplicationForm";
import Container from "@/components/shared/Container";
import { ApplicationContextProvider } from "@/context/ApplicationContext";

const newApplication = () => {
  return (
    <Container>
      <ApplicationContextProvider>
        <ApplicationForm />
      </ApplicationContextProvider>
    </Container>
  );
};

export default newApplication;
