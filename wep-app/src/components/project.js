import React, { Component } from "react"
import { Card, Button, Form, Col } from "react-bootstrap"
import axios from "axios"

class Project extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleAddTaskSubmit = this.handleAddTaskSubmit.bind(this);
    this.handleDeleteProjectSubmit = this.handleDeleteProjectSubmit.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.onFinishTask = this.onFinishTask.bind(this);
    this.updateTasks = this.updateTasks.bind(this);
    this.state = {
      name: this.props.project.name,
      tasks: this.props.project.tasks,
      index: this.props.index,
      locationState: this.props.locationState,
      hide: 'block'
    };
  }

  updateTasks() {
    axios.put(
      `${process.env.API_BASEPATH}/users/${this.state.locationState.userId}/projects/tasks`,
      {
        index: this.state.index,
        tasks: this.state.tasks,
      },
      {
        headers: {
          Authorization: this.state.locationState.token,
        },
      },
    )
      .then(({ data }) => {
        console.log("Tasks updated!")
      })
      .catch((error) => {
        alert(error.response ? JSON.stringify(error.response.data) : JSON.stringify(error));
      })
  }

  deleteProject() {
    axios.put(
      `${process.env.API_BASEPATH}/users/${this.state.locationState.userId}/projects/${this.state.name}`,
      {},
      {
        headers: {
          Authorization: this.state.locationState.token,
        },
      },
    )
      .then(({ data }) => {
        console.log("PROJECT DELETED");
      })
      .catch((error) => {
        alert(error.response ? JSON.stringify(error.response.data) : JSON.stringify(error));
      })
  }

  handleDeleteProjectSubmit(event) {
    event.preventDefault();
    this.setState({hide: 'none'})
    this.deleteProject();
  }

  handleAddTaskSubmit(event) {
    event.preventDefault();

    console.log({
      taskDescription: event.target["0"].value,
    });

    const description = event.target["0"].value;

    this.setState(state => {
      const tasks = [
        ...state.tasks,
        { description, creationDate: new Date().toISOString() },
      ];

      return { name: state.name, tasks };
    });

    this.updateTasks();
  }

  getTasks() {
    const todo = [];
    const done = [];

    this.state.tasks.forEach((task, index) => {
      const taskWithIndex = { ...task, index };
      if (task.finishDate) {
        done.push(taskWithIndex);
      } else {
        todo.push(taskWithIndex);
      }
    })

    return { todo, done };
  }

  onFinishTask(index, event) {
    event.preventDefault();

    console.log({
      index,
      event: event.target["0"],
    })

    const tasks = [...this.state.tasks];
    tasks[index].finishDate = new Date().toISOString();
    this.setState({ tasks });

    this.updateTasks();
  }

  render() {
    const { todo, done } = this.getTasks();
    
    return (
      <div style={{paddingTop: '10px', display: this.state.hide}}>
        <Card>
          <Card.Header>
            {this.state.name}
            <Form onSubmit={this.handleDeleteProjectSubmit} style={{
              "float": "right",
            }}>
              <Button variant="primary" type="submit" >
                Remove
            </Button>
            </Form>
          </Card.Header>
          <Card.Body>
            <Card.Title>To Do</Card.Title>
            <Card.Text>
              {todo.map(todoTask =>
                <Form.Check title={todoTask.creationDate} onChange={(e) => this.onFinishTask(todoTask.index, e)} type="checkbox" label={todoTask.description} />
              )}
            </Card.Text>
            <Card.Title>Done</Card.Title>
            <Card.Text className="text-muted">
              {done.map(doneTask =>
                <Form.Check title={doneTask.finishDate} type="checkbox" label={doneTask.description} checked />
              )}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Form onSubmit={this.handleAddTaskSubmit}>
              <Form.Group controlId="formAddTaskName">
                <Form.Control type="text" placeholder="Task" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add
            </Button>
            </Form>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}

export default Project
