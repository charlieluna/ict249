<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

	protected $response;
  public function __construct() {
		parent::__construct();
		$this->load->helper('url');
		$this->load->helper('date');
		$this->response = array(
			'success' => true, 
			'data' => array(),
			'error_type' => '',
			'message' => ''
		);
  }
  
  public function _remap($method, $params = array()) {
  	/*
  	if (!method_exists($this, $method)) {
  		$this->response['error_type'] = 'exception';
  		$this->response['message'] = '404 Not found.';
  		echo json_encode(array('success' => false, 'data' => array()));
  		return;
  	}
  	
  	$token = $this->input->get('token');
  	if(!$token || $token != APP_TOKEN) {
  		$this->response['error_type'] = 'exception';
  		$this->response['message'] = '404 Not found.';
  		echo json_encode(array('success' => false, 'data' => array()));
  	}
  	else {
  		return call_user_func_array(array($this, $method), $params);
  	}
  	*/
  	return call_user_func_array(array($this, $method), $params);
  }
  
}