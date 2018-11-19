<?php

class GeocodeTest extends TestCase
{

    public function testUsaForecasted()
    {
        $response = $this->call('GET', 'api/geocode/denver/forecasted');
        $this->assertEquals(200, $response->status());
    }

    public function testUsaObserved()
    {
        $response = $this->call('GET', 'api/geocode/denver/observed');
        $this->assertEquals(200, $response->status());
    }

    public function testInternationalForecasted()
    {
        $response = $this->call('GET', 'api/geocode/lisbon/forecasted');
        $this->assertEquals(200, $response->status());
    }

    public function testInternationalObserved()
    {
        $response = $this->call('GET', 'api/geocode/lisbon/observed');
        $this->assertEquals(200, $response->status());
    }

    public function testInvalidValueForecasted()
    {
        $response = $this->call('GET', 'api/geocode/#12$#/forecasted');
        $this->assertEquals(404, $response->status());
    }

    public function testInvalidValueObserved()
    {
        $response = $this->call('GET', 'api/geocode/#12$#/observed');
        $this->assertEquals(404, $response->status());
    }

    public function testEmptySubmitForecasted()
    {
        $response = $this->call('GET', 'api/geocode//forecasted');
        $this->assertEquals(404, $response->status());
    }

    public function testEmptySubmitObserved()
    {
        $response = $this->call('GET', 'api/geocode//observed');
        $this->assertEquals(404, $response->status());
    }


}
