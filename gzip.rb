require 'zlib'

file_to_zip = ARGV[0]

puts "Gzipping #{file_to_zip}..."

base_name = File.basename(file_to_zip)

file_name_zip = "#{file_to_zip}.gz"

base_name_zip = "zip_#{base_name}"

File.open(file_name_zip, 'w') do |f|

  gz = Zlib::GzipWriter.new(f)
    
  IO.foreach(file_to_zip) {|x| 
    gz.write x
  }   
    
  gz.close
  
end

puts "Gzipped version saved as #{file_name_zip}"