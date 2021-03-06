import React, { Component } from 'react';
import {
	Card,
	CardImg,
	CardText,
	CardBody,
	Breadcrumb,
	BreadcrumbItem,
	Modal,
	ModalHeader,
	ModalBody,
	Button,
	Label
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	toggleModal() {
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

	handleSubmit(values) {
		this.toggleModal();
		this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
	}

	render() {
		return (
			<div>
				<Button outline onClick={this.toggleModal}>
					Submit Comment
					<i className="fa fa-pencil fa-lg" />
				</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}> submit comment </ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<div className="form-group">
								<label htmlFor="rating">Rating</label>
								
								<Control.select
									className="form-control"
									model=".rating"
									name="rating"
									id="rating"
									defaultValue="1"
								>
									<option>1</option>
									<option>2</option>
									<option>3</option>
									<option>4</option>
									<option>5</option>
									
								</Control.select>
							</div>
							<div classsName="form-group">
								<Label htmlFor="author">Name</Label>
								<Control.text
									className="form-control"
									model=".author"
									name="author"
									id="author"
									validators={{
										required,
										minLength: minLength(2),
										maxLength: maxLength(15)
									}}
								/>
								<Errors
									className="text-danger"
									model=".author"
									show="touched"
									component="div"
									messages={{
										minLength: 'Name must be at least 2 charaters long',
										maxLength: 'Name must be less than 15 characters'
									}}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="text">Comments</label>
								<Control.textarea className="form-control" model=".text" name="text" id="text" />
							</div>

							<Button color="primary" type="submit">
								Submit
							</Button>
						</LocalForm>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

function RenderCampsite({ campsite }) {
	return (
		<div className="col-md-5 m-1">
		<FadeTransform
			in
			transformProps={{
				exitTransform: 'scale(0.5) translateY(-50%)'
			}}>
			<Card>
				<CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
				<CardBody>
					<CardText>{campsite.description}</CardText>
				</CardBody>
			</Card>
		</FadeTransform>
	</div>
	);
}

function RenderComments({ comments, postComment, campsiteId }) {
	console.log(comments);
	if (comments) {
		return (
			<div className="col-md-5 m-1">
			<h4>Comments</h4>
                <Stagger in>
                    {
                        comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Stagger>
				<CommentForm campsiteId={campsiteId} postComment={postComment} />
			</div>
		);
	}
	return <div />;
}

function CampsiteInfo(props) {
	if (props.isLoading) {
		return (
			<div className="container">
				<div className="row">
					<Loading />
				</div>
			</div>
		);
	}
	if (props.errMess) {
		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<h4>{props.errMess}</h4>
					</div>
				</div>
			</div>
		);
	}
	if (props.campsite) {
		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<Breadcrumb>
							<BreadcrumbItem>
								<Link to="/directory">Directory</Link>
							</BreadcrumbItem>
							<BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
						</Breadcrumb>
						<h2>{props.campsite.name}</h2>
						<hr />
					</div>
				</div>
				<div className="row">
					<RenderCampsite campsite={props.campsite} />
					<RenderComments
						comments={props.comments}
						postComment={props.postComment}
						campsiteId={props.campsite.id}
					/>
				</div>
			</div>
		);
	}
	return <div />;
}

export default CampsiteInfo;
