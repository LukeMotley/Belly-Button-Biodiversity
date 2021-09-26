// Set up a function for the dashboard
function dashboard() {

    // Define Dropdown Menu Element
    var dropdown = d3.select("#selDataset");
    
    // Use the D3 library to read in samples.json / check with the console function
    d3.json("samples.json").then((data) => {
      console.log(data);
  
      // Define a variable for the sample names
      var sample_names = data.names;
  
      // Add samples to the dropdown menu
      sample_names.forEach((x) => {
        dropdown
          .append("option")
          .text(x)
          .property("value", x);
      });
    
      // Run metadata and chart functions
      metadata(sample_names[0]);
      charts(sample_names[0]);
    });
  }
  
  
  // Function to collect and display the metadata
  function metadata(x) {
    d3.json("samples.json").then((data) => {
  
      //  Get data from metadata
      var metadata = data.metadata;
  
      // Loop through metadata with the filter function
      var metadata_object = metadata.filter(meta_object => meta_object.id == x)[0];
  
      //  Locate where to display the sample on the html file
      var sample_metadata = d3.select("#sample-metadata");
  
      // Clear output
      sample_metadata.html("");
  
      // Add data for the selected object into the previously defined html location
      Object.entries(metadata_object).forEach(([key, value]) => {
        sample_metadata.append("p").text(`${key}: ${value}`);
      });
    });
  }
  
  // Function to build Charts
  function charts(x) {
  
    d3.json("samples.json").then((data) => {
  
      //  Get data from samples
      var samples = data.samples;
  
      // Loop through samples with the filter function
      var sample_object = samples.filter(object => object.id == x)[0];
  
      // Define variables for otu_ids, otu_labels and sample_values
      var ids = sample_object.otu_ids;
      var labels = sample_object.otu_labels;
      var sample_values = sample_object.sample_values;
  
      // Slice the top 10 OTUs and format the otuID
      var top_ids = ids.slice(0, 10).reverse().map(otuID => `OTU ${otuID}`);
      var top_labels = labels.slice(0, 10).reverse();
      var top_sample_values = sample_values.slice(0, 10).reverse();
  
      // Build bar chart
      var bar_chart_data =[
        {
          x: top_sample_values,
          y: top_ids,
          text: top_labels,
          type: "bar",
          orientation: "h"
        }
      ];
  
      var bar_layout = {
        margin: { t: 25, l: 150 }
      };
  
      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", bar_chart_data, bar_layout);
  
  
      // Build bubble chart
  
      var bubble_chart_data = [ 
        {
          x: ids,
          y: sample_values,
          text: labels,
          mode: "markers",
          marker: {
            color: ids,
            colorscale: 'Portland',
            size: sample_values,
            }
        }
      ];
  
      var bubble_layout = {
        xaxis: { title: "OTU ID" },
      };
  
      // Render the plot to the div tag with id "bubble"
      Plotly.newPlot("bubble", bubble_chart_data, bubble_layout);
  
  });
  }
   
  // Set up a function for any change in the dropdown menu selection
  function optionChanged(new_selection) {
  
  // Get new data for each new selection, calling our previously built functions
    charts(new_selection);
    metadata(new_selection);
  };
  
  // Start dashboard function
  dashboard();