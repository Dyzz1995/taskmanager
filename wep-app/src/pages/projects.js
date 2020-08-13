import React, { Component } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import axios from "axios"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Project from "../components/project"
import NotFoundPage from "./404"

class SecondPage extends Component {
  constructor(props, context) {
    super(props, context);

    this.addProject = this.addProject.bind(this);

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.getProjects();
  }

  getProjects() {
    axios.get(`${process.env.API_BASEPATH}/users/${this.props.location.state.userId}/projects`,
        {
          headers: {
            Authorization: this.props.location.state.token,
          },
        },
      )
      .then(({ data }) => {
        const projects = data.map((project, index) =>
          <Col sm={6}>
            <Project project={project} index={index} locationState={this.props.location.state}></Project>
          </Col>
        );
        this.setState({ projects });
      })
      .catch((error) => {
        alert(error.response ? JSON.stringify(error.response.data) : JSON.stringify(error));
      })
  }

  verifyLogin() {
    const { state } = this.props.location;
    if (state) {
      const { token, user, userId } = state;
      if (token && user && userId) {
        return true;
      }
    }

    return false;
  }

  addProject(event) {
    event.preventDefault();
    
    console.log({
      projectName: event.target["0"].value,
    });

    const project = {
      name: event.target["0"].value,
      tasks: [],
    };

    axios
      .put(
        `${process.env.API_BASEPATH}/users/${this.props.location.state.userId}/projects`,
        { name: project.name },
        {
          headers: {
            Authorization: this.props.location.state.token,
          },
        },
      )
      .then(({ data }) => {
        const newProject = <Col sm={6}>
          <Project project={project} index={this.state.projects.length} locationState={this.props.location.state}></Project>
        </Col>;

        this.setState(state => {
          const projects = [...state.projects, newProject];

          return { projects };
        });
      })
      .catch((error) => {
        alert(error.response ? JSON.stringify(error.response.data) : JSON.stringify(error));
      })
  }

  render() {
    const isLoggedIn = this.verifyLogin();

    return (
      <>
        {isLoggedIn
          ?
          <Layout user={this.props.location.state.user}>
            <SEO title="Projects" />
            <Row style={{
              "padding-top": "10px",
            }}>
              <Col sm={8} >
                <Row>
                  {this.state.projects}
                </Row>
              </Col>
              <Col sm={4} >
                <Form onSubmit={this.addProject}>
                  <Form.Group controlId="formNewProjectName">
                    <Form.Label>Create a new project</Form.Label>
                    <Form.Control type="text" placeholder="Project name" />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Create Project
                  </Button>
                </Form>
              </Col>
            </Row>
          </Layout>
          :
          <NotFoundPage></NotFoundPage>
        }
      </>
    );
  }
}
export default SecondPage
