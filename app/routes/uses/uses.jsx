import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
import { List, ListItem } from '~/components/list';
import { Table, TableBody, TableCell, TableHeadCell, TableRow } from '~/components/table';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import styles from './uses.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Uses',
    description: 'A list of backend frameworks, databases, DevOps tools, and hardware I use',
  });
};

export const Uses = () => {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title="Uses"
          description="A comprehensive overview of the backend frameworks, databases, cloud services, and tools I use on a daily basis to architect scalable microservices and APIs."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Backend & Frameworks</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://fastapi.tiangolo.com/">FastAPI</Link> is my primary framework for building high-performance, asynchronous REST APIs with Pydantic schemas and auto-generated OpenAPI documentation.
                  </ListItem>
                  <ListItem>
                    <Link href="https://www.django-rest-framework.org/">Django REST Framework</Link> for robust, feature-rich web backends, ORM data modeling, and complex business logic.
                  </ListItem>
                  <ListItem>
                    <Link href="https://docs.celeryq.dev/">Celery</Link> & <Link href="https://redis.io/">Redis</Link> for background job execution, distributed task queues, rate limiting, and caching.
                  </ListItem>
                  <ListItem>
                    <Link href="https://www.sqlalchemy.org/">SQLAlchemy</Link> and <Link href="https://alembic.sqlalchemy.org/">Alembic</Link> for database migrations and asynchronous database access.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Databases & Cloud</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://www.postgresql.org/">PostgreSQL</Link> is my database of choice for relational data modeling, spatial indexing, and query optimization.
                  </ListItem>
                  <ListItem>
                    <Link href="https://cloud.google.com/">Google Cloud Platform</Link> for cloud services including Cloud Tasks and Pub/Sub messaging.
                  </ListItem>
                  <ListItem>
                    <Link href="https://www.docker.com/">Docker</Link> for containerizing microservices and managing environment configurations across dev and production.
                  </ListItem>
                  <ListItem>
                    <Link href="https://supabase.com/">Supabase</Link> for rapid Auth (RBAC), storage, and real-time backend integrations.
                  </ListItem>
                  <ListItem>
                    <Link href="https://platform.openai.com/">OpenAI</Link> & <Link href="https://langchain.com/">LangChain / LangGraph</Link> for building LLM agents and multi-modal AI integrations.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m">
              <ProjectSectionHeading>Development System</ProjectSectionHeading>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHeadCell>IDE / Code Editor</TableHeadCell>
                    <TableCell>VS Code / PyCharm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>API Testing</TableHeadCell>
                    <TableCell>Postman / Bruno / Swagger UI</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Database Management</TableHeadCell>
                    <TableCell>DBeaver / pgAdmin</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Version Control</TableHeadCell>
                    <TableCell>Git / GitHub</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Terminal / Shell</TableHeadCell>
                    <TableCell>Zsh / PowerShell</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
