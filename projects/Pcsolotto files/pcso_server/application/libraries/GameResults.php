<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class GameResults {
	
	private $source;
	private $filter;
	
	public function __construct($params) {
		$this->source = $params['src_url'];
	}
	
	/**
	 * 
	 * @param unknown $filter
	 * 	keys : from_date (yyyy/mm/dd), to_date (yyyy/mm/dd), category 
	 */
	
	public function set_filter($filter = array()) {
		
		$this->filter = $filter;
	} 
	
	private function get_filter_str() {
		$from_date = date_parse($this->filter['from_date']);
		$to_date = date_parse($this->filter['to_date']);
		
		$query = array(
			'from_year' => $from_date['year'],
			'from_month' => $from_date['month'],
			'from_day' => $from_date['day'],
			'to_year' => $to_date['year'],
			'to_month' => $to_date['month'],
			'to_day' => $to_date['day'],
			'category' => $this->filter['category']
 		);
		
		return "?".http_build_query($query);
	}
	
	
	public function get() {
		$url = $this->source.$this->get_filter_str()	;
		$page = file_get_html($url);
		$res = $page->find('div[id=results-data] table tr');
		
		$results = array();
		foreach($res as $r) {
			$td = $r->find('td');
			if(count($td) > 1) {
				$results[] = array(
						'game' => trim($td[0]->plaintext),
						'result' => trim($td[1]->plaintext),
						'date' => trim($td[2]->plaintext)
				);
			}
		}
		
		return $results;
	}
	
}