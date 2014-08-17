<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pcso extends MY_Controller {
	
	public function __construct() {
		parent::__construct();
		$this->load->library('simple_html_dom');
		$this->load->library('GameResults', array('src_url' => $this->config->item('site_pcso_url')));
		
	}
	public function index() {
		exit('No direct script access allowed');
	}
	
	public function check() {
		
		$code = 'D4L';
		$filter = array(
			'from_date' => '2014-08-16',
			'to_date' => '2014-08-16',
			'category' => GameCodes::get_code(strtoupper($code))
		);
		
		$this->gameresults->set_filter($filter);
		$result = $this->gameresults->get();
		$this->response['success'] = true;
		$this->response['data'] = $result;
		if(!$result) {
			$this->response['message'] = "No Results Found.";
		}
		echo json_encode($this->response);
	}
	
}

/* End of file pcso.php */
/* Location: ./application/controllers/pcso.php */